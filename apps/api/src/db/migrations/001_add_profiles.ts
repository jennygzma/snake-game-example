/**
 * Migration: Add Profiles Table and Migrate Existing Themes
 * 
 * This migration:
 * 1. Creates a default profile if none exist
 * 2. Links all existing themes to the default profile
 * 
 * Run this migration manually after updating the schema:
 * npx tsx apps/api/src/db/migrations/001_add_profiles.ts
 */

import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import { mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "../../../data/snake.db");
mkdirSync(path.dirname(DB_PATH), { recursive: true });

function runMigration() {
  console.log("🔄 Starting profile migration...");
  
  const db = new Database(DB_PATH);
  
  try {
    // Check if profiles table exists and has any profiles
    const profileCount = db.prepare("SELECT COUNT(*) as count FROM profiles").get() as { count: number };
    
    if (profileCount.count === 0) {
      console.log("📝 No profiles found. Creating default profile...");
      
      // Create a default profile
      const defaultProfileId = randomUUID();
      const now = new Date().toISOString();
      
      db.prepare(`
        INSERT INTO profiles (id, name, avatar_base64, created_at, updated_at, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(defaultProfileId, "Default Player", null, now, now, 1);
      
      console.log(`✅ Created default profile: ${defaultProfileId}`);
      
      // Update all existing themes to link to the default profile
      const themesUpdated = db.prepare(`
        UPDATE custom_themes
        SET profile_id = ?
        WHERE profile_id IS NULL
      `).run(defaultProfileId);
      
      console.log(`✅ Migrated ${themesUpdated.changes} themes to default profile`);
    } else {
      console.log(`ℹ️  Found ${profileCount.count} existing profiles. Checking for unmigrated themes...`);
      
      // Get the first active profile or any profile
      const activeProfile = db.prepare(`
        SELECT id FROM profiles WHERE is_active = 1 LIMIT 1
      `).get() as { id: string } | undefined;
      
      const anyProfile = activeProfile || db.prepare(`
        SELECT id FROM profiles LIMIT 1
      `).get() as { id: string };
      
      if (anyProfile) {
        // Update themes that don't have a profile_id
        const themesUpdated = db.prepare(`
          UPDATE custom_themes
          SET profile_id = ?
          WHERE profile_id IS NULL
        `).run(anyProfile.id);
        
        if (themesUpdated.changes > 0) {
          console.log(`✅ Migrated ${themesUpdated.changes} themes to profile ${anyProfile.id}`);
        } else {
          console.log("✅ No themes need migration");
        }
      }
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
