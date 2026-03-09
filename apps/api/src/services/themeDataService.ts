import type { Database } from "better-sqlite3";
import type {
  CustomTheme,
  SaveThemeInput,
  ThemesListResponse,
  ThemeResponse,
  ActiveThemeResponse
} from "@snake/contracts";
import { themeQueries } from "../db/themeQueries";
import { profileQueries } from "../db/profileQueries";

export const createThemeDataService = (db: Database) => {
  const queries = themeQueries(db);
  const profileQs = profileQueries(db);

  return {
    /**
     * List all themes for a profile
     */
    listThemes(profileId: string): ThemesListResponse {
      const themes = queries.listByProfileId(profileId);
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
     * Get the active theme for a profile
     */
    getActiveTheme(profileId: string): ActiveThemeResponse {
      const theme = queries.getActiveByProfileId(profileId);
      return { theme };
    },

    /**
     * Create a new theme for active profile
     */
    createTheme(userId: string, input: SaveThemeInput): ThemeResponse {
      // Get active profile
      const activeProfile = profileQs.getActive();
      if (!activeProfile) {
        throw new Error("No active profile found");
      }
      
      const theme = queries.create(userId, activeProfile.id, input);
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