import Database from 'better-sqlite3';

export function up(db: Database.Database): void {
  // Shared Themes Table
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
    );

    CREATE INDEX IF NOT EXISTS idx_shared_themes_creator ON shared_themes(creator_profile_id);
    CREATE INDEX IF NOT EXISTS idx_shared_themes_favorite_count ON shared_themes(favorite_count DESC);
    CREATE INDEX IF NOT EXISTS idx_shared_themes_usage_count ON shared_themes(usage_count DESC);
    CREATE INDEX IF NOT EXISTS idx_shared_themes_created_at ON shared_themes(created_at DESC);
  `);

  // Shared Variations Table
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
    );

    CREATE INDEX IF NOT EXISTS idx_shared_variations_creator ON shared_variations(creator_profile_id);
    CREATE INDEX IF NOT EXISTS idx_shared_variations_favorite_count ON shared_variations(favorite_count DESC);
    CREATE INDEX IF NOT EXISTS idx_shared_variations_usage_count ON shared_variations(usage_count DESC);
    CREATE INDEX IF NOT EXISTS idx_shared_variations_created_at ON shared_variations(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_shared_variations_difficulty ON shared_variations(difficulty);
  `);

  // Theme Favorites Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS theme_favorites (
      profile_id TEXT NOT NULL,
      shared_theme_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (profile_id, shared_theme_id),
      FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
      FOREIGN KEY (shared_theme_id) REFERENCES shared_themes(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_theme_favorites_shared_theme ON theme_favorites(shared_theme_id);
  `);

  // Variation Favorites Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS variation_favorites (
      profile_id TEXT NOT NULL,
      shared_variation_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (profile_id, shared_variation_id),
      FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
      FOREIGN KEY (shared_variation_id) REFERENCES shared_variations(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_variation_favorites_shared_variation ON variation_favorites(shared_variation_id);
  `);
}

export function down(db: Database.Database): void {
  db.exec(`
    DROP INDEX IF EXISTS idx_variation_favorites_shared_variation;
    DROP TABLE IF EXISTS variation_favorites;

    DROP INDEX IF EXISTS idx_theme_favorites_shared_theme;
    DROP TABLE IF EXISTS theme_favorites;

    DROP INDEX IF EXISTS idx_shared_variations_difficulty;
    DROP INDEX IF EXISTS idx_shared_variations_created_at;
    DROP INDEX IF EXISTS idx_shared_variations_usage_count;
    DROP INDEX IF EXISTS idx_shared_variations_favorite_count;
    DROP INDEX IF EXISTS idx_shared_variations_creator;
    DROP TABLE IF EXISTS shared_variations;

    DROP INDEX IF EXISTS idx_shared_themes_created_at;
    DROP INDEX IF EXISTS idx_shared_themes_usage_count;
    DROP INDEX IF EXISTS idx_shared_themes_favorite_count;
    DROP INDEX IF EXISTS idx_shared_themes_creator;
    DROP TABLE IF EXISTS shared_themes;
  `);
}