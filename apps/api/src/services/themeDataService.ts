import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { join } from "path";
import type {
  ActiveThemeResponse,
  CreateThemeInput,
  CustomTheme,
  ThemeListResponse,
  UpdateThemeInput
} from "@snake/contracts";
import { themeQueries } from "../db/themeQueries";

// Initialize database
const dbPath = join(process.cwd(), "data", "snake.db");
const db = new Database(dbPath);

// Run schema initialization
const schema = readFileSync(join(process.cwd(), "src", "db", "schema.sql"), "utf-8");
db.exec(schema);

// Initialize queries
const queries = themeQueries(db);

// Hard-coded user ID for single-user app
const DEFAULT_USER_ID = "dev-user-1";

export const themeDataService = {
  // Get all themes for the user
  getAllThemes(): ThemeListResponse {
    const themes = queries.getAllThemes(DEFAULT_USER_ID);
    return { themes };
  },

  // Get a specific theme by ID
  getTheme(id: string): CustomTheme | null {
    return queries.getThemeById(id, DEFAULT_USER_ID);
  },

  // Get the active theme
  getActiveTheme(): ActiveThemeResponse {
    const theme = queries.getActiveTheme(DEFAULT_USER_ID);
    return { theme };
  },

  // Create a new theme
  createTheme(input: CreateThemeInput): CustomTheme {
    const now = new Date().toISOString();
    return queries.createTheme({
      id: crypto.randomUUID(),
      userId: DEFAULT_USER_ID,
      name: input.name,
      fontFamily: input.fontFamily,
      colors: input.colors,
      iconColors: input.iconColors,
      createdAt: now,
      updatedAt: now
    });
  },

  // Update an existing theme
  updateTheme(id: string, input: UpdateThemeInput): CustomTheme | null {
    return queries.updateTheme(id, DEFAULT_USER_ID, {
      ...input,
      updatedAt: new Date().toISOString()
    });
  },

  // Delete a theme
  deleteTheme(id: string): boolean {
    return queries.deleteTheme(id, DEFAULT_USER_ID);
  },

  // Set a theme as active
  activateTheme(id: string): CustomTheme | null {
    return queries.setActiveTheme(id, DEFAULT_USER_ID);
  }
};