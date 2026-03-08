-- Custom themes table for storing user-defined themes
CREATE TABLE IF NOT EXISTS custom_themes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT 'default-user',
  font_family TEXT NOT NULL,
  colors TEXT NOT NULL, -- JSON string of ThemeColors
  icon_colors TEXT NOT NULL, -- JSON string of ThemeIconColors
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 0, -- SQLite boolean (0 or 1)
  UNIQUE(user_id, name) -- Prevent duplicate theme names per user
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_custom_themes_user_id ON custom_themes(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_themes_active ON custom_themes(user_id, is_active);