import Database from "better-sqlite3";
import type { CustomTheme, ThemeColors, ThemeIconColors } from "@snake/contracts";

export interface ThemeRow {
  id: string;
  name: string;
  user_id: string;
  font_family: string;
  colors: string;
  icon_colors: string;
  created_at: string;
  updated_at: string;
  is_active: number;
}

const rowToTheme = (row: ThemeRow): CustomTheme => ({
  id: row.id,
  name: row.name,
  userId: row.user_id,
  fontFamily: row.font_family,
  colors: JSON.parse(row.colors) as ThemeColors,
  iconColors: JSON.parse(row.icon_colors) as ThemeIconColors,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  isActive: row.is_active === 1
});

export const getAllThemes = (db: Database.Database, userId: string): CustomTheme[] => {
  const stmt = db.prepare<[string]>(
    "SELECT * FROM custom_themes WHERE user_id = ? ORDER BY created_at DESC"
  );
  const rows = stmt.all(userId) as ThemeRow[];
  return rows.map(rowToTheme);
};

export const getThemeById = (db: Database.Database, id: string, userId: string): CustomTheme | null => {
  const stmt = db.prepare<[string, string]>(
    "SELECT * FROM custom_themes WHERE id = ? AND user_id = ?"
  );
  const row = stmt.get(id, userId) as ThemeRow | undefined;
  return row ? rowToTheme(row) : null;
};

export const getActiveTheme = (db: Database.Database, userId: string): CustomTheme | null => {
  const stmt = db.prepare<[string]>(
    "SELECT * FROM custom_themes WHERE user_id = ? AND is_active = 1 LIMIT 1"
  );
  const row = stmt.get(userId) as ThemeRow | undefined;
  return row ? rowToTheme(row) : null;
};

export const createTheme = (
  db: Database.Database,
  theme: Omit<CustomTheme, "id" | "createdAt" | "updatedAt">
): CustomTheme => {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  const stmt = db.prepare(
    `INSERT INTO custom_themes (id, name, user_id, font_family, colors, icon_colors, created_at, updated_at, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  
  stmt.run(
    id,
    theme.name,
    theme.userId,
    theme.fontFamily,
    JSON.stringify(theme.colors),
    JSON.stringify(theme.iconColors),
    now,
    now,
    theme.isActive ? 1 : 0
  );
  
  return {
    ...theme,
    id,
    createdAt: now,
    updatedAt: now
  };
};

export const updateTheme = (
  db: Database.Database,
  id: string,
  userId: string,
  updates: Partial<Pick<CustomTheme, "name" | "fontFamily" | "colors" | "iconColors">>
): CustomTheme | null => {
  const existing = getThemeById(db, id, userId);
  if (!existing) return null;
  
  const now = new Date().toISOString();
  const updatedTheme = {
    ...existing,
    ...updates,
    updatedAt: now
  };
  
  const stmt = db.prepare(
    `UPDATE custom_themes 
     SET name = ?, font_family = ?, colors = ?, icon_colors = ?, updated_at = ?
     WHERE id = ? AND user_id = ?`
  );
  
  stmt.run(
    updatedTheme.name,
    updatedTheme.fontFamily,
    JSON.stringify(updatedTheme.colors),
    JSON.stringify(updatedTheme.iconColors),
    now,
    id,
    userId
  );
  
  return updatedTheme;
};

export const deleteTheme = (db: Database.Database, id: string, userId: string): boolean => {
  const stmt = db.prepare<[string, string]>(
    "DELETE FROM custom_themes WHERE id = ? AND user_id = ?"
  );
  const result = stmt.run(id, userId);
  return result.changes > 0;
};

export const setActiveTheme = (db: Database.Database, id: string, userId: string): boolean => {
  // First, verify the theme exists and belongs to the user
  const theme = getThemeById(db, id, userId);
  if (!theme) return false;
  
  // Deactivate all themes for this user
  const deactivateStmt = db.prepare<[string]>(
    "UPDATE custom_themes SET is_active = 0 WHERE user_id = ?"
  );
  deactivateStmt.run(userId);
  
  // Activate the specified theme
  const activateStmt = db.prepare<[string, string]>(
    "UPDATE custom_themes SET is_active = 1, updated_at = ? WHERE id = ? AND user_id = ?"
  );
  const now = new Date().toISOString();
  activateStmt.run(now, id, userId);
  
  return true;
};