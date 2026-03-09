import type { Database } from "better-sqlite3";
import type {
  CustomTheme,
  SaveThemeInput,
  ThemesListResponse,
  ThemeResponse,
  ActiveThemeResponse
} from "@snake/contracts";
import { themeQueries } from "../db/themeQueries";

export const createThemeDataService = (db: Database) => {
  const queries = themeQueries(db);

  return {
    /**
     * List all themes for a user (optionally filtered by profile)
     */
    listThemes(userId: string, profileId?: string): ThemesListResponse {
      const themes = queries.listByUserId(userId, profileId);
      return { themes };
    },

    /**
     * Get a specific theme by ID
     */
    getTheme(themeId: string): ThemeResponse | null {
      const theme = queries.getById(themeId);
      if (!theme) return null;
      return { theme };
    },

    /**
     * Get the active theme for a user
     */
    getActiveTheme(userId: string): ActiveThemeResponse {
      const theme = queries.getActive(userId);
      return { theme };
    },

    /**
     * Create a new theme
     */
    createTheme(userId: string, input: SaveThemeInput, profileId?: string): ThemeResponse {
      const theme = queries.create(userId, input, profileId);
      return { theme };
    },

    /**
     * Update an existing theme
     */
    updateTheme(themeId: string, input: SaveThemeInput): ThemeResponse | null {
      const theme = queries.update(themeId, input);
      if (!theme) return null;
      return { theme };
    },

    /**
     * Delete a theme
     */
    deleteTheme(themeId: string): boolean {
      return queries.delete(themeId);
    },

    /**
     * Activate a theme (and deactivate all others for the user)
     */
    activateTheme(themeId: string): ThemeResponse | null {
      const theme = queries.setActive(themeId);
      if (!theme) return null;
      return { theme };
    }
  };
};