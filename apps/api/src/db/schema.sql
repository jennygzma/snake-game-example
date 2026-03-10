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
  profile_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  font_family TEXT NOT NULL,
  colors TEXT NOT NULL,
  icon_colors TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 0,
  CHECK (is_active IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_custom_themes_user_id ON custom_themes(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_themes_profile_id ON custom_themes(profile_id);
CREATE INDEX IF NOT EXISTS idx_custom_themes_is_active ON custom_themes(is_active);
