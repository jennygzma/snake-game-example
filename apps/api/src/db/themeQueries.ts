import Database from "better-sqlite3";
import type { CustomTheme, ThemeColors, ThemeIconColors } from "@snake/contracts";

type DbThemeRow = {
  id: string;
  name: string;
  user_id: string;
  font_family: string;
  colors: string;
  icon_colors: string;
  is_active: number;
  created_at: string;
  updated_at: string;
};

const rowToTheme = (row: DbThemeRow): CustomTheme => ({
  id: row.id,
  name: row.name,
  userId: row.user_id,
  fontFamily: row.font_family,
  colors: JSON.parse(row.colors) as ThemeColors,
  iconColors: JSON.parse(row.icon_colors) as ThemeIconColors,
  isActive: row.is_active === 1,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const themeQueries = (db: Database.Database) => ({
  // Get all themes for a user
  getAllThemes(userId: string): CustomTheme[] {
    const rows = db
      .prepare(
        `SELECT * FROM custom_themes 
         WHERE user_id = ? 
         ORDER BY created_at DESC`
      )
      .all(userId) as DbThemeRow[];

    return rows.map(rowToTheme);
  },

  // Get a specific theme by ID
  getThemeById(id: string, userId: string): CustomTheme | null {
    const row = db
      .prepare(
        `SELECT * FROM custom_themes 
         WHERE id = ? AND user_id = ?`
      )
      .get(id, userId) as DbThemeRow | undefined;

    return row ? rowToTheme(row) : null;
  },

  // Get the active theme for a user
  getActiveTheme(userId: string): CustomTheme | null {
    const row = db
      .prepare(
        `SELECT * FROM custom_themes 
         WHERE user_id = ? AND is_active = 1 
         LIMIT 1`
      )
      .get(userId) as DbThemeRow | undefined;

    return row ? rowToTheme(row) : null;
  },

  // Create a new theme
  createTheme(theme: {
    id: string;
    name: string;
    userId: string;
    fontFamily: string;
    colors: ThemeColors;
    iconColors: ThemeIconColors;
    createdAt: string;
    updatedAt: string;
  }): CustomTheme {
    db.prepare(
      `INSERT INTO custom_themes 
       (id, name, user_id, font_family, colors, icon_colors, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)`
    ).run(
      theme.id,
      theme.name,
      theme.userId,
      theme.fontFamily,
      JSON.stringify(theme.colors),
      JSON.stringify(theme.iconColors),
      theme.createdAt,
      theme.updatedAt
    );

    return {
      ...theme,
      isActive: false
    };
  },

  // Update an existing theme
  updateTheme(
    id: string,
    userId: string,
    updates: {
      name?: string;
      fontFamily?: string;
      colors?: ThemeColors;
      iconColors?: ThemeIconColors;
      updatedAt: string;
    }
  ): CustomTheme | null {
    const existing = this.getThemeById(id, userId);
    if (!existing) return null;

    const setParts: string[] = [];
    const values: unknown[] = [];

    if (updates.name !== undefined) {
      setParts.push("name = ?");
      values.push(updates.name);
    }
    if (updates.fontFamily !== undefined) {
      setParts.push("font_family = ?");
      values.push(updates.fontFamily);
    }
    if (updates.colors !== undefined) {
      setParts.push("colors = ?");
      values.push(JSON.stringify(updates.colors));
    }
    if (updates.iconColors !== undefined) {
      setParts.push("icon_colors = ?");
      values.push(JSON.stringify(updates.iconColors));
    }

    setParts.push("updated_at = ?");
    values.push(updates.updatedAt);

    values.push(id, userId);

    db.prepare(
      `UPDATE custom_themes 
       SET ${setParts.join(", ")}
       WHERE id = ? AND user_id = ?`
    ).run(...values);

    return this.getThemeById(id, userId);
  },

  // Delete a theme
  deleteTheme(id: string, userId: string): boolean {
    const result = db
      .prepare(
        `DELETE FROM custom_themes 
         WHERE id = ? AND user_id = ?`
      )
      .run(id, userId);

    return result.changes > 0;
  },

  // Set a theme as active (deactivates all others)
  setActiveTheme(id: string, userId: string): CustomTheme | null {
    const theme = this.getThemeById(id, userId);
    if (!theme) return null;

    // Deactivate all themes for this user
    db.prepare(
      `UPDATE custom_themes 
       SET is_active = 0 
       WHERE user_id = ?`
    ).run(userId);

    // Activate the selected theme
    db.prepare(
      `UPDATE custom_themes 
       SET is_active = 1, updated_at = ? 
       WHERE id = ? AND user_id = ?`
    ).run(new Date().toISOString(), id, userId);

    return this.getThemeById(id, userId);
  }
});