import Database from "better-sqlite3";
import { randomUUID } from "crypto";

/**
 * Migration: Add game variations support
 * 
 * This migration:
 * 1. Creates the game_variations table
 * 2. Adds variation_id column to game_runs
 * 3. Creates a "Classic" variation for each existing profile
 * 4. Backfills all existing game_runs with their profile's Classic variation
 */
export function runMigration(db: Database.Database): void {
  console.log("Running migration: 002_add_game_variations");

  db.transaction(() => {
    // Step 1: Create game_variations table
    db.exec(`
      CREATE TABLE IF NOT EXISTS game_variations (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'custom')),
        
        -- Visual customization (stored as base64 or hex color)
        snake_head_image TEXT,
        board_background_color TEXT,
        
        -- Powerup configuration (stored as JSON)
        powerups TEXT NOT NULL,
        max_concurrent_foods INTEGER NOT NULL DEFAULT 1 CHECK (max_concurrent_foods >= 1 AND max_concurrent_foods <= 10),
        
        -- Game rules
        base_speed INTEGER NOT NULL CHECK (base_speed >= 1 AND base_speed <= 30),
        grid_size INTEGER NOT NULL CHECK (grid_size >= 8 AND grid_size <= 64),
        
        -- Metadata
        usage_count INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 0 CHECK (is_active IN (0, 1)),
        
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_game_variations_profile_id ON game_variations(profile_id);
      CREATE INDEX IF NOT EXISTS idx_game_variations_is_active ON game_variations(is_active);
    `);

    // Step 2: Add variation_id to game_runs (if not already exists)
    // SQLite doesn't support ALTER TABLE ADD COLUMN IF NOT EXISTS, so we check first
    const columnExists = db
      .prepare(
        `SELECT COUNT(*) as count FROM pragma_table_info('game_runs') WHERE name='variation_id'`
      )
      .get() as { count: number };

    if (columnExists.count === 0) {
      db.exec(`
        ALTER TABLE game_runs ADD COLUMN variation_id TEXT REFERENCES game_variations(id) ON DELETE SET NULL;
        CREATE INDEX IF NOT EXISTS idx_game_runs_variation_id ON game_runs(variation_id);
      `);
    }

    // Step 3: Get all existing profiles
    const profiles = db
      .prepare("SELECT id, name FROM profiles")
      .all() as Array<{ id: string; name: string }>;

    const now = new Date().toISOString();

    // Step 4: Create "Classic" variation for each profile
    const insertVariation = db.prepare(`
      INSERT INTO game_variations (
        id, profile_id, name, description, difficulty,
        snake_head_image, board_background_color,
        powerups, max_concurrent_foods,
        base_speed, grid_size,
        usage_count, created_at, updated_at, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Map to store profile_id -> classic_variation_id
    const profileVariationMap = new Map<string, string>();

    for (const profile of profiles) {
      const variationId = randomUUID();
      const classicPowerups = JSON.stringify([
        {
          id: randomUUID(),
          effect: "points_multiplier",
          value: 1,
          color: "#87ae73", // Using design system green color
          image: null
        }
      ]);

      insertVariation.run(
        variationId,
        profile.id,
        "Classic",
        "Traditional snake game with standard rules",
        "medium",
        null, // no snake head image
        null, // no background color
        classicPowerups,
        1, // single food
        8, // default speed
        20, // default grid size
        0, // initial usage count
        now,
        now,
        1 // set as active by default
      );

      profileVariationMap.set(profile.id, variationId);
      console.log(
        `Created Classic variation ${variationId} for profile ${profile.id} (${profile.name})`
      );
    }

    // Step 5: Backfill existing game_runs with their profile's Classic variation
    const updateRuns = db.prepare(`
      UPDATE game_runs 
      SET variation_id = ? 
      WHERE profile_id = ? AND variation_id IS NULL
    `);

    let totalUpdated = 0;
    for (const [profileId, variationId] of profileVariationMap.entries()) {
      const result = updateRuns.run(variationId, profileId);
      const changes = result.changes;
      totalUpdated += changes;
      console.log(
        `Backfilled ${changes} game runs for profile ${profileId} with Classic variation`
      );
    }

    console.log(
      `Migration complete: Created ${profiles.length} Classic variations, backfilled ${totalUpdated} game runs`
    );
  })();
}

/**
 * Run this migration directly if executed as a script
 */
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  const dbPath = process.env.DB_PATH || "./data/snake.db";
  const db = new Database(dbPath);
  
  try {
    runMigration(db);
    console.log("✅ Migration completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    db.close();
  }
}
