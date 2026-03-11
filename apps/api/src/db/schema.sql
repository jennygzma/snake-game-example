-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_base64 TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 0,
  CHECK (is_active IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

-- Custom Themes Table
CREATE TABLE IF NOT EXISTS custom_themes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  profile_id TEXT,
  name TEXT NOT NULL,
  font_family TEXT NOT NULL,
  colors TEXT NOT NULL,
  icon_colors TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 0,
  CHECK (is_active IN (0, 1)),
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_custom_themes_user_id ON custom_themes(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_themes_profile_id ON custom_themes(profile_id);
CREATE INDEX IF NOT EXISTS idx_custom_themes_is_active ON custom_themes(is_active);

-- Game Runs Table (profile-scoped with cascade delete)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS themes (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  name TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 0,
  snake_color TEXT NOT NULL,
  snake_head_color TEXT NOT NULL,
  food_color TEXT NOT NULL,
  board_background_color TEXT NOT NULL,
  board_grid_color TEXT NOT NULL,
  ui_primary_color TEXT NOT NULL,
  ui_background_color TEXT NOT NULL,
  ui_text_color TEXT NOT NULL,
  ui_border_color TEXT NOT NULL,
  font_family TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_themes_profile_id ON themes(profile_id);
CREATE INDEX IF NOT EXISTS idx_themes_active ON themes(is_active);

CREATE TABLE IF NOT EXISTS game_variations (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  snake_head_image TEXT,
  powerups TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_game_variations_profile_id ON game_variations(profile_id);

CREATE TABLE IF NOT EXISTS game_runs (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  duration_ms INTEGER NOT NULL,
  ended_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  variation_id TEXT,
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (variation_id) REFERENCES game_variations(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_game_runs_profile_id ON game_runs(profile_id);
CREATE INDEX IF NOT EXISTS idx_game_runs_score ON game_runs(score DESC);
CREATE INDEX IF NOT EXISTS idx_game_runs_ended_at ON game_runs(ended_at DESC);

-- Per-profile game settings
CREATE TABLE IF NOT EXISTS game_settings (
  profile_id TEXT PRIMARY KEY,
  speed INTEGER NOT NULL,
  grid_size INTEGER NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);
