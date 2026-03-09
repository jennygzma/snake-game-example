import type { CustomTheme, SaveThemeInput } from "@snake/contracts";
import { themeQueries } from "../db/themeQueries";

const DEFAULT_USER_ID = "default-user";

export const themeDataService = {
  // List all themes for the default user
  listThemes(): CustomTheme[] {
    return themeQueries.listByUser(DEFAULT_USER_ID);
  },

  // Get a specific theme by ID
  getTheme(id: string): CustomTheme | null {
    const theme = themeQueries.getById(id);
    // Security: Only return if it belongs to default user
    if (theme && theme.userId !== DEFAULT_USER_ID) {
      return null;
    }
    return theme;
  },

  // Get the active theme for the default user
  getActiveTheme(): CustomTheme | null {
    return themeQueries.getActive(DEFAULT_USER_ID);
  },

  // Create a new theme
  createTheme(input: SaveThemeInput): CustomTheme {
    return themeQueries.create({
      name: input.name,
      userId: DEFAULT_USER_ID,
      fontFamily: input.fontFamily,
      colors: input.colors,
      iconColors: input.iconColors,
      isActive: false // New themes are not active by default
    });
  },

  // Update an existing theme
  updateTheme(id: string, input: Partial<SaveThemeInput>): CustomTheme | null {
    const existing = this.getTheme(id);
    if (!existing) {
      return null;
    }

    return themeQueries.update(id, {
      name: input.name,
      fontFamily: input.fontFamily,
      colors: input.colors,
      iconColors: input.iconColors
    });
  },

  // Delete a theme
  deleteTheme(id: string): boolean {
    const existing = this.getTheme(id);
    if (!existing) {
      return false;
    }

    // Don't allow deleting the active theme
    if (existing.isActive) {
      return false;
    }

    return themeQueries.delete(id);
  },

  // Activate a theme (deactivates all others)
  activateTheme(id: string): CustomTheme | null {
    const existing = this.getTheme(id);
    if (!existing) {
      return null;
    }

    return themeQueries.setActive(id);
  }
};