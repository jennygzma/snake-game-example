/**
 * Migration: Add Hub Sharing Tables
 * 
 * This migration:
 * 1. Creates shared_themes table for public theme sharing
 * 2. Creates shared_variations table for public variation sharing
 * 3. Creates theme_favorites table for user favorites
 * 4. Creates variation_favorites table for user favorites
 * 
 * Run this migration manually after updating the schema:
 * npx tsx apps/api/src/db/migrations/003_add_hub_tables.ts
 */

import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const DB_PATH = process.env.SNAKE_DB_PATH ?? path.join(process.cwd(), "apps/api/src/data/snake.db");

function runMigration() {
  console.log("🔄 Starting hub tables migration...");
  
  const db = new Database(DB_PATH);
  
  try {
    // Create shared_themes table
    console.log("📝 Creating shared_themes table...");
    db.exec(`
      CREATE TABLE IF NOT EXISTS shared_themes (
        id TEXT PRIMARY KEY,
        creator_profile_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        font_family TEXT NOT NULL,
        colors TEXT NOT NULL,
        icon_colors TEXT NOT NULL,
        favorite_count INTEGER NOT NULL DEFAULT 0,
        usage_count INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (creator_profile_id) REFERENCES profiles(id) ON DELETE CASCADE
      )
    `);
    
    // Create indexes for shared_themes
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_shared_themes_creator_profile_id 
        ON shared_themes(creator_profile_id);
      CREATE INDEX IF NOT EXISTS idx_shared_themes_created_at 
        ON shared_themes(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_shared_themes_favorite_count 
        ON shared_themes(favorite_count DESC);
      CREATE INDEX IF NOT EXISTS idx_shared_themes_usage_count 
        ON shared_themes(usage_count DESC);
    `);
    console.log("✅ shared_themes table created");
    
    // Create shared_variations table
    console.log("📝 Creating shared_variations table...");
    db.exec(`
      CREATE TABLE IF NOT EXISTS shared_variations (
        id TEXT PRIMARY KEY,
        creator_profile_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        difficulty TEXT,
        base_speed INTEGER NOT NULL,
        grid_size INTEGER NOT NULL,
        max_concurrent_foods INTEGER NOT NULL,
        snake_head_image TEXT,
        powerup_types TEXT NOT NULL,
        custom_colors TEXT,
        favorite_count INTEGER NOT NULL DEFAULT 0,
        usage_count INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (creator_profile_id) REFERENCES profiles(id) ON DELETE CASCADE
      )
    `);
    
    // Create indexes for shared_variations
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_shared_variations_creator_profile_id 
        ON shared_variations(creator_profile_id);
      CREATE INDEX IF NOT EXISTS idx_shared_variations_created_at 
        ON shared_variations(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_shared_variations_difficulty 
        ON shared_variations(difficulty);
      CREATE INDEX IF NOT EXISTS idx_shared_variations_favorite_count 
        ON shared_variations(favorite_count DESC);
      CREATE INDEX IF NOT EXISTS idx_shared_variations_usage_count 
        ON shared_variations(usage_count DESC);
    `);
    console.log("✅ shared_variations table created");
    
    // Create theme_favorites table
    console.log("📝 Creating theme_favorites table...");
    db.exec(`
      CREATE TABLE IF NOT EXISTS theme_favorites (
        profile_id TEXT NOT NULL,
        shared_theme_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        PRIMARY KEY (profile_id, shared_theme_id),
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
        FOREIGN KEY (shared_theme_id) REFERENCES shared_themes(id) ON DELETE CASCADE
      )
    `);
    
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_theme_favorites_profile_id 
        ON theme_favorites(profile_id);
      CREATE INDEX IF NOT EXISTS idx_theme_favorites_shared_theme_id 
        ON theme_favorites(shared_theme_id);
    `);
    console.log("✅ theme_favorites table created");
    
    // Create variation_favorites table
    console.log("📝 Creating variation_favorites table...");
    db.exec(`
      CREATE TABLE IF NOT EXISTS variation_favorites (
        profile_id TEXT NOT NULL,
        shared_variation_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        PRIMARY KEY (profile_id, shared_variation_id),
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
        FOREIGN KEY (shared_variation_id) REFERENCES shared_variations(id) ON DELETE CASCADE
      )
    `);
    
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_variation_favorites_profile_id 
        ON variation_favorites(profile_id);
      CREATE INDEX IF NOT EXISTS idx_variation_favorites_shared_variation_id 
        ON variation_favorites(shared_variation_id);
    `);
    console.log("✅ variation_favorites table created");
    
    console.log("✨ Hub tables migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    db.close();
  }
}

const isDirectExecution =
  process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  runMigration();
}

export { runMigration };