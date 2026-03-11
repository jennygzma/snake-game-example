import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import { DEFAULT_CLASSIC_VARIATION } from "@snake/contracts";

export const up = (db: Database.Database): void => {
  console.log("Running migration: 002_add_game_variations");

  // Create game_variations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS game_variations (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      difficulty TEXT,
      base_speed INTEGER NOT NULL,
      grid_size INTEGER NOT NULL,
      max_concurrent_foods INTEGER NOT NULL,
      snake_head_image TEXT,
      powerup_types TEXT NOT NULL,
      custom_colors TEXT,
      usage_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_game_variations_profile_id ON game_variations(profile_id);
    CREATE INDEX IF NOT EXISTS idx_game_variations_usage_count ON game_variations(usage_count DESC);
  `);

  // Check if variation_id column exists in game_runs
  const tableInfo = db.pragma("table_info(game_runs)") as Array<{ name: string }>;
  const hasVariationId = tableInfo.some(
    (col) => col.name === "variation_id"
  );

  if (!hasVariationId) {
    // Add variation_id column to game_runs
    db.exec(`
      ALTER TABLE game_runs ADD COLUMN variation_id TEXT;
      CREATE INDEX IF NOT EXISTS idx_game_runs_variation_id ON game_runs(variation_id);
    `);
  }

  // Get all existing profiles
  const profiles = db.prepare("SELECT id FROM profiles").all() as Array<{ id: string }>;

  if (profiles.length > 0) {
    console.log(`Creating Classic variation for ${profiles.length} profile(s)`);

    const now = new Date().toISOString();
    const insertVariation = db.prepare(`
      INSERT INTO game_variations (
        id, profile_id, name, description, difficulty,
        base_speed, grid_size, max_concurrent_foods,
        powerup_types, usage_count, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `);

    const updateGameRuns = db.prepare(`
      UPDATE game_runs 
      SET variation_id = ? 
      WHERE profile_id = ? AND variation_id IS NULL
    `);

    // Create Classic variation for each profile and backfill their game runs
    for (const profile of profiles) {
      const variationId = randomUUID();
      
      insertVariation.run(
        variationId,
        profile.id,
        DEFAULT_CLASSIC_VARIATION.name,
        DEFAULT_CLASSIC_VARIATION.description,
        DEFAULT_CLASSIC_VARIATION.difficulty,
        DEFAULT_CLASSIC_VARIATION.baseSpeed,
        DEFAULT_CLASSIC_VARIATION.gridSize,
        DEFAULT_CLASSIC_VARIATION.maxConcurrentFoods,
        JSON.stringify(DEFAULT_CLASSIC_VARIATION.powerupTypes),
        now,
        now
      );

      // Backfill existing game_runs for this profile
      const result = updateGameRuns.run(variationId, profile.id);
      console.log(`  Profile ${profile.id}: Created variation ${variationId}, backfilled ${result.changes} game runs`);
    }
  }

  console.log("Migration 002_add_game_variations completed");
};

export const down = (db: Database.Database): void => {
  console.log("Rolling back migration: 002_add_game_variations");

  // Remove variation_id column from game_runs (SQLite doesn't support DROP COLUMN directly)
  // This is a destructive operation, so we'll need to recreate the table
  db.exec(`
    -- Create temporary table without variation_id
    CREATE TABLE game_runs_backup (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      duration_ms INTEGER NOT NULL,
      ended_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    -- Copy data
    INSERT INTO game_runs_backup SELECT id, profile_id, score, duration_ms, ended_at, created_at FROM game_runs;

    -- Drop original table
    DROP TABLE game_runs;

    -- Rename backup
    ALTER TABLE game_runs_backup RENAME TO game_runs;

    -- Recreate indexes
    CREATE INDEX idx_game_runs_profile_id ON game_runs(profile_id);
    CREATE INDEX idx_game_runs_score ON game_runs(score DESC);
    CREATE INDEX idx_game_runs_ended_at ON game_runs(ended_at DESC);

    -- Drop game_variations table
    DROP TABLE IF EXISTS game_variations;
  `);

  console.log("Migration 002_add_game_variations rolled back");
};