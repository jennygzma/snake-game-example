import type { Database } from "better-sqlite3";
import type { CustomTheme, SaveThemeInput, ThemeColors, ThemeIconColors } from "@snake/contracts";

export const themeQueries = (db: Database) => ({
  /**
   * List all themes for a profile
   */
  listByUserId(userId: string): CustomTheme[] {
    const rows = db
      .prepare(
        `SELECT id, profile_id, name, font_family, colors, icon_colors, created_at, updated_at, is_active
         FROM custom_themes
         WHERE profile_id = ?
         ORDER BY created_at DESC`
      )
      .all(userId) as Array<{
      id: string;
      profile_id: string;
      name: string;
      font_family: string;
      colors: string;
      icon_colors: string;
      created_at: string;
      updated_at: string;
      is_active: number;
    }>;

    return rows.map((row) => ({
      id: row.id,
      userId: row.profile_id,
      name: row.name,
      fontFamily: row.font_family,
      colors: JSON.parse(row.colors) as ThemeColors,
      iconColors: JSON.parse(row.icon_colors) as ThemeIconColors,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isActive: row.is_active === 1
    }));
  },

  /**
   * Get a specific theme by ID
   */
  getById(id: string): CustomTheme | null {
    const row = db
      .prepare(
        `SELECT id, profile_id, name, font_family, colors, icon_colors, created_at, updated_at, is_active
         FROM custom_themes
         WHERE id = ?`
      )
      .get(id) as
      | {
          id: string;
          profile_id: string;
          name: string;
          font_family: string;
          colors: string;
          icon_colors: string;
          created_at: string;
          updated_at: string;
          is_active: number;
        }
      | undefined;

    if (!row) return null;

    return {
      id: row.id,
      userId: row.profile_id,
      name: row.name,
      fontFamily: row.font_family,
      colors: JSON.parse(row.colors) as ThemeColors,
      iconColors: JSON.parse(row.icon_colors) as ThemeIconColors,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isActive: row.is_active === 1
    };
  },

  /**
   * Get the active theme for a profile
   */
  getActive(userId: string): CustomTheme | null {
    const row = db
      .prepare(
        `SELECT id, profile_id, name, font_family, colors, icon_colors, created_at, updated_at, is_active
         FROM custom_themes
         WHERE profile_id = ? AND is_active = 1
         LIMIT 1`
      )
      .get(userId) as
      | {
          id: string;
          profile_id: string;
          name: string;
          font_family: string;
          colors: string;
          icon_colors: string;
          created_at: string;
          updated_at: string;
          is_active: number;
        }
      | undefined;

    if (!row) return null;

    return {
      id: row.id,
      userId: row.profile_id,
      name: row.name,
      fontFamily: row.font_family,
      colors: JSON.parse(row.colors) as ThemeColors,
      iconColors: JSON.parse(row.icon_colors) as ThemeIconColors,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isActive: row.is_active === 1
    };
  },

  /**
   * Create a new theme
   */
  create(userId: string, input: SaveThemeInput): CustomTheme {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO custom_themes (id, profile_id, name, font_family, colors, icon_colors, created_at, updated_at, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`
    ).run(
      id,
      userId,
      input.name,
      input.fontFamily,
      JSON.stringify(input.colors),
      JSON.stringify(input.iconColors),
      now,
      now
    );

    return {
      id,
      userId,
      name: input.name,
      fontFamily: input.fontFamily,
      colors: input.colors,
      iconColors: input.iconColors,
      createdAt: now,
      updatedAt: now,
      isActive: false
    };
  },

  /**
   * Update an existing theme
   */
  update(id: string, input: SaveThemeInput): CustomTheme | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const now = new Date().toISOString();

    db.prepare(
      `UPDATE custom_themes
       SET name = ?, font_family = ?, colors = ?, icon_colors = ?, updated_at = ?
       WHERE id = ?`
    ).run(
      input.name,
      input.fontFamily,
      JSON.stringify(input.colors),
      JSON.stringify(input.iconColors),
      now,
      id
    );

    return {
      ...existing,
      name: input.name,
      fontFamily: input.fontFamily,
      colors: input.colors,
      iconColors: input.iconColors,
      updatedAt: now
    };
  },

  /**
   * Delete a theme
   */
  delete(id: string): boolean {
    const result = db.prepare(`DELETE FROM custom_themes WHERE id = ?`).run(id);
    return result.changes > 0;
  },

  /**
   * Set a theme as active (and deactivate all others for the user)
   */
  setActive(id: string): CustomTheme | null {
    const theme = this.getById(id);
    if (!theme) return null;

    // Deactivate all themes for this profile
    db.prepare(`UPDATE custom_themes SET is_active = 0 WHERE profile_id = ?`).run(theme.userId);

    // Activate the specified theme
    db.prepare(`UPDATE custom_themes SET is_active = 1 WHERE id = ?`).run(id);

    return {
      ...theme,
      isActive: true
    };
  }
});