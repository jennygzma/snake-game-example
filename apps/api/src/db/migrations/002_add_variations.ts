import Database from "better-sqlite3";

export const runMigration = (db: Database.Database): void => {
  console.log("Running migration 002_add_variations...");

  // Create game_variations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS game_variations (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
      
      -- Visual customization
      snake_head_image TEXT,
      
      -- Powerup configuration (stored as JSON)
      max_concurrent_foods INTEGER NOT NULL,
      enabled_powerups TEXT NOT NULL,
      
      -- Game rules
      base_speed INTEGER NOT NULL,
      base_grid_size INTEGER NOT NULL,
      
      -- Metadata
      is_public INTEGER NOT NULL DEFAULT 0,
      usage_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      
      CHECK (is_public IN (0, 1)),
      CHECK (max_concurrent_foods >= 1 AND max_concurrent_foods <= 5),
      CHECK (base_speed >= 1 AND base_speed <= 30),
      CHECK (base_grid_size >= 8 AND base_grid_size <= 64),
      
      FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    );
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_game_variations_profile_id 
    ON game_variations(profile_id);
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_game_variations_difficulty 
    ON game_variations(difficulty);
  `);

  // Add variation_id to game_runs
  db.exec(`
    ALTER TABLE game_runs ADD COLUMN variation_id TEXT 
    REFERENCES game_variations(id) ON DELETE SET NULL;
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_game_runs_variation_id 
    ON game_runs(variation_id);
  `);

  console.log("Migration 002_add_variations completed successfully.");
};

// Create "Classic" variation for each existing profile
export const createClassicVariations = (db: Database.Database): void => {
  console.log("Creating Classic variations for existing profiles...");

  const profiles = db.prepare("SELECT id FROM profiles").all() as Array<{ id: string }>;

  const insertVariation = db.prepare(`
    INSERT INTO game_variations (
      id, profile_id, name, description, difficulty,
      max_concurrent_foods, enabled_powerups, base_speed, base_grid_size,
      is_public, usage_count, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();
  
  for (const profile of profiles) {
    const classicId = `classic-${profile.id}`;
    const classicPowerup = JSON.stringify([
      {
        id: "default-food",
        name: "Food",
        effect: "add_blocks",
        effectValue: 1,
        color: "#87ae73"
      }
    ]);

    insertVariation.run(
      classicId,
      profile.id,
      "Classic",
      "The original snake game",
      "medium",
      1, // maxConcurrentFoods
      classicPowerup,
      8, // baseSpeed
      20, // baseGridSize
      0, // isPublic
      0, // usageCount
      now,
      now
    );

    // Backfill existing game_runs with classic variation_id
    db.prepare(`
      UPDATE game_runs 
      SET variation_id = ? 
      WHERE profile_id = ? AND variation_id IS NULL
    `).run(classicId, profile.id);

    console.log(`Created Classic variation for profile ${profile.id}`);
  }

  console.log("Classic variations created successfully.");
};