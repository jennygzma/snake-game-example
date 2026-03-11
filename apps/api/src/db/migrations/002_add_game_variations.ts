/**
 * Migration: Add Game Variations Table and Migrate Existing Data
 * 
 * This migration:
 * 1. Adds variation_id column to game_runs table
 * 2. Creates a "Classic" variation for each existing profile
 * 3. Backfills all existing game_runs to reference their profile's Classic variation
 * 
 * Run this migration manually after updating the schema:
 * npx tsx apps/api/src/db/migrations/002_add_game_variations.ts
 */

import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import path from "path";

const DB_PATH = path.join(process.cwd(), "apps/api/snake.db");

function runMigration() {
  console.log("🔄 Starting game variations migration...");
  
  const db = new Database(DB_PATH);
  
  try {
    // Check if game_variations table exists
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='game_variations'
    `).get();
    
    if (!tableExists) {
      console.log("❌ game_variations table does not exist. Please run schema.sql first.");
      return;
    }
    
    // Check if we need to run the migration
    const existingVariations = db.prepare("SELECT COUNT(*) as count FROM game_variations").get() as { count: number };
    
    if (existingVariations.count > 0) {
      console.log(`ℹ️  Found ${existingVariations.count} existing variations. Skipping Classic variation creation.`);
    } else {
      console.log("📝 Creating Classic variations for all profiles...");
      
      // Get all profiles
      const profiles = db.prepare("SELECT id FROM profiles").all() as Array<{ id: string }>;
      
      if (profiles.length === 0) {
        console.log("⚠️  No profiles found. Please create a profile first.");
        return;
      }
      
      // Create a Classic variation for each profile
      const insertVariation = db.prepare(`
        INSERT INTO game_variations (
          id, profile_id, name, description, difficulty,
          base_speed, grid_size, max_concurrent_foods,
          powerup_types, usage_count, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const classicPowerups = JSON.stringify([
        {
          effect: "double_points",
          value: 1,
          color: "#87ae73"
        }
      ]);
      
      const now = new Date().toISOString();
      let createdCount = 0;
      
      for (const profile of profiles) {
        const variationId = randomUUID();
        insertVariation.run(
          variationId,
          profile.id,
          "Classic",
          "Traditional snake game with standard rules",
          "medium",
          8,
          20,
          1,
          classicPowerups,
          0,
          now,
          now
        );
        createdCount++;
        console.log(`✅ Created Classic variation for profile ${profile.id}: ${variationId}`);
      }
      
      console.log(`✅ Created ${createdCount} Classic variations`);
    }
    
    // Backfill existing game_runs with their profile's Classic variation
    console.log("📝 Backfilling game_runs with variation_id...");
    
    // Get all game runs without a variation_id
    const runsToUpdate = db.prepare(`
      SELECT id, profile_id FROM game_runs WHERE variation_id IS NULL
    `).all() as Array<{ id: string; profile_id: string }>;
    
    if (runsToUpdate.length === 0) {
      console.log("✅ No game runs need backfilling");
    } else {
      console.log(`📝 Found ${runsToUpdate.length} game runs to backfill`);
      
      const updateRun = db.prepare(`
        UPDATE game_runs 
        SET variation_id = (
          SELECT id FROM game_variations 
          WHERE profile_id = ? AND name = 'Classic' 
          LIMIT 1
        )
        WHERE id = ?
      `);
      
      let updatedCount = 0;
      for (const run of runsToUpdate) {
        const result = updateRun.run(run.profile_id, run.id);
        if (result.changes > 0) {
          updatedCount++;
        }
      }
      
      console.log(`✅ Backfilled ${updatedCount} game runs with Classic variation`);
    }
    
    console.log("✨ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    db.close();
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  runMigration();
}

export { runMigration };