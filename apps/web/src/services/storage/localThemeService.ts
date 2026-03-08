import {
  customThemeSchema,
  saveThemeInputSchema,
  themesListResponseSchema,
  themeResponseSchema,
  activeThemeResponseSchema,
  type CustomTheme,
  type SaveThemeInput,
  type ThemeResponse,
  type ThemesListResponse,
  type ActiveThemeResponse
} from "@snake/contracts";
import type { ThemeService } from "../themeService";

const THEMES_KEY = "snake.themes";

const readThemes = (): CustomTheme[] => {
  const raw = localStorage.getItem(THEMES_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return themesListResponseSchema.parse({ themes: parsed }).themes;
  } catch {
    return [];
  }
};

const writeThemes = (themes: CustomTheme[]): void => {
  localStorage.setItem(THEMES_KEY, JSON.stringify(themes));
};

export const localThemeService: ThemeService = {
  async getAllThemes(): Promise<ThemesListResponse> {
    const themes = readThemes().sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );
    return themesListResponseSchema.parse({ themes });
  },

  async getThemeById(id: string): Promise<ThemeResponse | null> {
    const theme = readThemes().find((t) => t.id === id);
    return theme ? themeResponseSchema.parse({ theme }) : null;
  },

  async getActiveTheme(): Promise<ActiveThemeResponse> {
    const theme = readThemes().find((t) => t.isActive);
    return activeThemeResponseSchema.parse({ theme: theme || null });
  },

  async createTheme(input: SaveThemeInput): Promise<ThemeResponse> {
    const parsed = saveThemeInputSchema.parse(input);
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const theme: CustomTheme = customThemeSchema.parse({
      id,
      name: parsed.name,
      userId: "local-user",
      fontFamily: parsed.fontFamily,
      colors: parsed.colors,
      iconColors: parsed.iconColors,
      createdAt: now,
      updatedAt: now,
      isActive: false
    });

    const themes = [theme, ...readThemes()];
    writeThemes(themes);

    return themeResponseSchema.parse({ theme });
  },

  async updateTheme(
    id: string,
    updates: Partial<SaveThemeInput>
  ): Promise<ThemeResponse | null> {
    const themes = readThemes();
    const existing = themes.find((t) => t.id === id);
    if (!existing) return null;

    const now = new Date().toISOString();

    const updated: CustomTheme = customThemeSchema.parse({
      id: existing.id,
      userId: existing.userId,
      name: updates.name ?? existing.name,
      fontFamily: updates.fontFamily ?? existing.fontFamily,
      colors: updates.colors ?? existing.colors,
      iconColors: updates.iconColors ?? existing.iconColors,
      createdAt: existing.createdAt,
      updatedAt: now,
      isActive: existing.isActive
    });

    const index = themes.indexOf(existing);
    themes[index] = updated;
    writeThemes(themes);

    return themeResponseSchema.parse({ theme: updated });
  },

  async deleteTheme(id: string): Promise<boolean> {
    const themes = readThemes();
    const filtered = themes.filter((t) => t.id !== id);
    if (filtered.length === themes.length) return false;

    writeThemes(filtered);
    return true;
  },

  async setActiveTheme(id: string): Promise<ThemeResponse | null> {
    const themes = readThemes();
    const theme = themes.find((t) => t.id === id);
    if (!theme) return null;

    const now = new Date().toISOString();

    const updated = themes.map((t) => ({
      ...t,
      isActive: t.id === id,
      updatedAt: t.id === id ? now : t.updatedAt
    }));

    writeThemes(updated);

    const activeTheme = updated.find((t) => t.id === id);
    return activeTheme ? themeResponseSchema.parse({ theme: activeTheme }) : null;
  }
};