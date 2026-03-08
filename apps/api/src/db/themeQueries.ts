import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { CustomTheme, ThemeColors, ThemeIconColors } from "@snake/contracts";

// Database initialization
let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database("snake-game.db");
    db.pragma("journal_mode = WAL");
    
    // Run schema migration
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const schemaPath = join(__dirname, "schema.sql");
    const schema = readFileSync(schemaPath, "utf-8");
    db.exec(schema);
  }
  return db;
}

// Database row interface
interface ThemeRow {
  id: string;
  name: string;
  user_id: string;
  font_family: string;
  colors: string; // JSON string
  icon_colors: string; // JSON string
  created_at: string;
  updated_at: string;
  is_active: number; // SQLite boolean (0 or 1)
}

// Convert database row to CustomTheme
function rowToTheme(row: ThemeRow): CustomTheme {
  return {
    id: row.id,
    name: row.name,
    userId: row.user_id,
    fontFamily: row.font_family,
    colors: JSON.parse(row.colors) as ThemeColors,
    iconColors: JSON.parse(row.icon_colors) as ThemeIconColors,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isActive: row.is_active === 1
  };
}

export const themeQueries = {
  // Get all themes for a user
  listByUser(userId: string): CustomTheme[] {
    const database = getDb();
    const stmt = database.prepare(`
      SELECT * FROM custom_themes
      WHERE user_id = ?
      ORDER BY created_at DESC
    `);
    const rows = stmt.all(userId) as ThemeRow[];
    return rows.map(rowToTheme);
  },

  // Get a specific theme by ID
  getById(id: string): CustomTheme | null {
    const database = getDb();
    const stmt = database.prepare(`
      SELECT * FROM custom_themes
      WHERE id = ?
    `);
    const row = stmt.get(id) as ThemeRow | undefined;
    return row ? rowToTheme(row) : null;
  },

  // Get the active theme for a user
  getActive(userId: string): CustomTheme | null {
    const database = getDb();
    const stmt = database.prepare(`
      SELECT * FROM custom_themes
      WHERE user_id = ? AND is_active = 1
      LIMIT 1
    `);
    const row = stmt.get(userId) as ThemeRow | undefined;
    return row ? rowToTheme(row) : null;
  },

  // Create a new theme
  create(theme: Omit<CustomTheme, "id" | "createdAt" | "updatedAt">): CustomTheme {
    const database = getDb();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const stmt = database.prepare(`
      INSERT INTO custom_themes (
        id, name, user_id, font_family, colors, icon_colors,
        created_at, updated_at, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

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
      id,
      ...theme,
      createdAt: now,
      updatedAt: now
    };
  },

  // Update an existing theme
  update(id: string, theme: Partial<Omit<CustomTheme, "id" | "userId" | "createdAt" | "updatedAt">>): CustomTheme | null {
    const database = getDb();
    const existing = this.getById(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];

    if (theme.name !== undefined) {
      updates.push("name = ?");
      values.push(theme.name);
    }
    if (theme.fontFamily !== undefined) {
      updates.push("font_family = ?");
      values.push(theme.fontFamily);
    }
    if (theme.colors !== undefined) {
      updates.push("colors = ?");
      values.push(JSON.stringify(theme.colors));
    }
    if (theme.iconColors !== undefined) {
      updates.push("icon_colors = ?");
      values.push(JSON.stringify(theme.iconColors));
    }
    if (theme.isActive !== undefined) {
      updates.push("is_active = ?");
      values.push(theme.isActive ? 1 : 0);
    }

    if (updates.length === 0) return existing;

    updates.push("updated_at = ?");
    values.push(now);
    values.push(id);

    const stmt = database.prepare(`
      UPDATE custom_themes
      SET ${updates.join(", ")}
      WHERE id = ?
    `);

    stmt.run(...values);
    return this.getById(id);
  },

  // Delete a theme
  delete(id: string): boolean {
    const database = getDb();
    const stmt = database.prepare(`
      DELETE FROM custom_themes
      WHERE id = ?
    `);
    const result = stmt.run(id);
    return result.changes > 0;
  },

  // Set a theme as active (deactivates all other themes for the user)
  setActive(id: string): CustomTheme | null {
    const database = getDb();
    const theme = this.getById(id);
    if (!theme) return null;

    // Deactivate all themes for this user
    const deactivateStmt = database.prepare(`
      UPDATE custom_themes
      SET is_active = 0
      WHERE user_id = ? AND is_active = 1
    `);
    deactivateStmt.run(theme.userId);

    // Activate the specified theme
    const activateStmt = database.prepare(`
      UPDATE custom_themes
      SET is_active = 1, updated_at = ?
      WHERE id = ?
    `);
    const now = new Date().toISOString();
    activateStmt.run(now, id);

    return this.getById(id);
  }
};