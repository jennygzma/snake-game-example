import {
  saveThemeInputSchema,
  themesListResponseSchema,
  themeResponseSchema,
  activeThemeResponseSchema,
  type CustomTheme,
  type SaveThemeInput,
  type ThemesListResponse,
  type ThemeResponse,
  type ActiveThemeResponse
} from "@snake/contracts";
import type { ThemeService } from "../themeService";

const THEMES_KEY = "snake.themes";

const readThemes = (): CustomTheme[] => {
  const raw = localStorage.getItem(THEMES_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeThemes = (themes: CustomTheme[]): void => {
  localStorage.setItem(THEMES_KEY, JSON.stringify(themes));
};

export const localThemeService: ThemeService = {
  async listThemes() {
    const themes = readThemes();
    return themesListResponseSchema.parse({ themes }) satisfies ThemesListResponse;
  },

  async getTheme(themeId: string) {
    const themes = readThemes();
    const theme = themes.find((t) => t.id === themeId);
    if (!theme) return null;
    return themeResponseSchema.parse({ theme }) satisfies ThemeResponse;
  },

  async getActiveTheme() {
    const themes = readThemes();
    const theme = themes.find((t) => t.isActive) ?? null;
    return activeThemeResponseSchema.parse({ theme }) satisfies ActiveThemeResponse;
  },

  async createTheme(input: SaveThemeInput) {
    const validated = saveThemeInputSchema.parse(input);
    const now = new Date().toISOString();

    const theme: CustomTheme = {
      id: crypto.randomUUID(),
      userId: "local-user",
      name: validated.name,
      fontFamily: validated.fontFamily,
      colors: validated.colors,
      iconColors: validated.iconColors,
      createdAt: now,
      updatedAt: now,
      isActive: false
    };

    const themes = [...readThemes(), theme];
    writeThemes(themes);

    return themeResponseSchema.parse({ theme }) satisfies ThemeResponse;
  },

  async updateTheme(themeId: string, input: SaveThemeInput) {
    const validated = saveThemeInputSchema.parse(input);
    const themes = readThemes();
    const existing = themes.find((t) => t.id === themeId);

    if (!existing) return null;

    const now = new Date().toISOString();
    const updatedTheme: CustomTheme = {
      id: existing.id,
      userId: existing.userId,
      name: validated.name,
      fontFamily: validated.fontFamily,
      colors: validated.colors,
      iconColors: validated.iconColors,
      createdAt: existing.createdAt,
      updatedAt: now,
      isActive: existing.isActive
    };

    const updatedThemes = themes.map((t) => (t.id === themeId ? updatedTheme : t));
    writeThemes(updatedThemes);

    return themeResponseSchema.parse({ theme: updatedTheme }) satisfies ThemeResponse;
  },

  async deleteTheme(themeId: string) {
    const themes = readThemes();
    const filtered = themes.filter((t) => t.id !== themeId);

    if (filtered.length === themes.length) {
      // Theme not found
      return false;
    }

    writeThemes(filtered);
    return true;
  },

  async activateTheme(themeId: string) {
    const themes = readThemes();
    const targetIndex = themes.findIndex((t) => t.id === themeId);

    if (targetIndex === -1) return null;

    // Deactivate all themes and activate the target
    const updatedThemes = themes.map((t, index) => ({
      ...t,
      isActive: index === targetIndex
    }));

    writeThemes(updatedThemes);

    return themeResponseSchema.parse({
      theme: updatedThemes[targetIndex]
    }) satisfies ThemeResponse;
  }
};