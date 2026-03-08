-- Custom themes table for storing user-created themes
CREATE TABLE IF NOT EXISTS custom_themes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  user_id TEXT NOT NULL,
  font_family TEXT NOT NULL,
  colors TEXT NOT NULL,
  icon_colors TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Index for faster lookup of active theme
CREATE INDEX IF NOT EXISTS idx_custom_themes_active ON custom_themes(user_id, is_active);

-- Index for theme lookup by user
CREATE INDEX IF NOT EXISTS idx_custom_themes_user ON custom_themes(user_id);