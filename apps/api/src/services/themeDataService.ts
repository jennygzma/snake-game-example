import type {
  CustomTheme,
  SaveThemeInput,
  ThemeResponse,
  ThemesListResponse,
  ActiveThemeResponse
} from "@snake/contracts";

type ThemeStore = {
  themes: CustomTheme[];
};

const store: ThemeStore = {
  themes: []
};

export const themeDataService = {
  getAllThemes(userId: string): ThemesListResponse {
    const themes = store.themes
      .filter((t) => t.userId === userId)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    return { themes };
  },

  getThemeById(id: string, userId: string): ThemeResponse | null {
    const theme = store.themes.find((t) => t.id === id && t.userId === userId);
    return theme ? { theme } : null;
  },

  getActiveTheme(userId: string): ActiveThemeResponse {
    const theme = store.themes.find((t) => t.userId === userId && t.isActive);
    return { theme: theme || null };
  },

  createTheme(userId: string, input: SaveThemeInput): ThemeResponse {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const theme: CustomTheme = {
      id,
      name: input.name,
      userId,
      fontFamily: input.fontFamily,
      colors: input.colors,
      iconColors: input.iconColors,
      createdAt: now,
      updatedAt: now,
      isActive: false
    };

    store.themes.push(theme);
    return { theme };
  },

  updateTheme(
    id: string,
    userId: string,
    updates: Partial<SaveThemeInput>
  ): ThemeResponse | null {
    const theme = store.themes.find((t) => t.id === id && t.userId === userId);
    if (!theme) return null;

    const now = new Date().toISOString();

    const updated: CustomTheme = {
      id: theme.id,
      userId: theme.userId,
      name: updates.name ?? theme.name,
      fontFamily: updates.fontFamily ?? theme.fontFamily,
      colors: updates.colors ?? theme.colors,
      iconColors: updates.iconColors ?? theme.iconColors,
      createdAt: theme.createdAt,
      updatedAt: now,
      isActive: theme.isActive
    };

    const index = store.themes.indexOf(theme);
    store.themes[index] = updated;

    return { theme: updated };
  },

  deleteTheme(id: string, userId: string): boolean {
    const index = store.themes.findIndex((t) => t.id === id && t.userId === userId);
    if (index === -1) return false;

    store.themes.splice(index, 1);
    return true;
  },

  setActiveTheme(id: string, userId: string): boolean {
    const theme = store.themes.find((t) => t.id === id && t.userId === userId);
    if (!theme) return false;

    // Deactivate all themes for this user
    store.themes.forEach((t) => {
      if (t.userId === userId) {
        t.isActive = false;
      }
    });

    // Activate the specified theme
    theme.isActive = true;
    theme.updatedAt = new Date().toISOString();

    return true;
  }
};