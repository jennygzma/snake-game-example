import {
  activeThemeResponseSchema,
  createThemeInputSchema,
  customThemeSchema,
  themeListResponseSchema,
  updateThemeInputSchema,
  type ActiveThemeResponse,
  type CreateThemeInput,
  type CustomTheme,
  type ThemeListResponse,
  type UpdateThemeInput
} from "@snake/contracts";
import type { ThemeService } from "../themeService";

const THEMES_KEY = "snake.themes";
const DEFAULT_USER_ID = "local-user-1";

const readThemes = (): CustomTheme[] => {
  const raw = localStorage.getItem(THEMES_KEY);
  if (!raw) return [];

  try {
    return themeListResponseSchema.parse({ themes: JSON.parse(raw) }).themes;
  } catch {
    return [];
  }
};

const writeThemes = (themes: CustomTheme[]): void => {
  localStorage.setItem(THEMES_KEY, JSON.stringify(themes));
};

export const localThemeService: ThemeService = {
  async getThemes() {
    const themes = readThemes();
    return themeListResponseSchema.parse({ themes }) satisfies ThemeListResponse;
  },

  async getTheme(id: string) {
    const themes = readThemes();
    const theme = themes.find((t) => t.id === id);
    if (!theme) {
      throw new Error("Theme not found");
    }
    return customThemeSchema.parse(theme);
  },

  async getActiveTheme() {
    const themes = readThemes();
    const activeTheme = themes.find((t) => t.isActive);
    return activeThemeResponseSchema.parse({
      theme: activeTheme ?? null
    }) satisfies ActiveThemeResponse;
  },

  async createTheme(input: CreateThemeInput) {
    const validated = createThemeInputSchema.parse(input);
    const now = new Date().toISOString();

    const newTheme: CustomTheme = {
      id: crypto.randomUUID(),
      userId: DEFAULT_USER_ID,
      name: validated.name,
      fontFamily: validated.fontFamily,
      colors: validated.colors,
      iconColors: validated.iconColors,
      isActive: false,
      createdAt: now,
      updatedAt: now
    };

    const themes = readThemes();
    writeThemes([newTheme, ...themes]);

    return customThemeSchema.parse(newTheme);
  },

  async updateTheme(id: string, input: UpdateThemeInput) {
    const validated = updateThemeInputSchema.parse(input);
    const themes = readThemes();
    const existing = themes.find((t) => t.id === id);

    if (!existing) {
      throw new Error("Theme not found");
    }

    const updated: CustomTheme = {
      id: existing.id,
      userId: existing.userId,
      name: validated.name ?? existing.name,
      fontFamily: validated.fontFamily ?? existing.fontFamily,
      colors: validated.colors ?? existing.colors,
      iconColors: validated.iconColors ?? existing.iconColors,
      isActive: existing.isActive,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString()
    };

    const newThemes = themes.map((t) => (t.id === id ? updated : t));
    writeThemes(newThemes);

    return customThemeSchema.parse(updated);
  },

  async deleteTheme(id: string) {
    const themes = readThemes();
    const filtered = themes.filter((t) => t.id !== id);

    if (filtered.length === themes.length) {
      throw new Error("Theme not found");
    }

    writeThemes(filtered);
  },

  async activateTheme(id: string) {
    const themes = readThemes();
    const targetTheme = themes.find((t) => t.id === id);

    if (!targetTheme) {
      throw new Error("Theme not found");
    }

    // Deactivate all themes and activate the selected one
    const updated = themes.map((t) =>
      t.id === id
        ? { ...t, isActive: true, updatedAt: new Date().toISOString() }
        : { ...t, isActive: false }
    );

    writeThemes(updated);

    const activatedTheme = updated.find((t) => t.id === id);
    if (!activatedTheme) {
      throw new Error("Failed to activate theme");
    }

    return customThemeSchema.parse(activatedTheme);
  }
};