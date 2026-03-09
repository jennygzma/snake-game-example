import {
  CustomThemeSchema,
  SaveThemeInputSchema,
  type CustomTheme,
  type SaveThemeInput
} from "@snake/contracts";
import type { ThemeService } from "../themeService";

const THEMES_KEY = "snake.themes";

const readThemes = (): CustomTheme[] => {
  const raw = localStorage.getItem(THEMES_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((t) => CustomThemeSchema.safeParse(t).success) : [];
  } catch {
    return [];
  }
};

const writeThemes = (themes: CustomTheme[]): void => {
  localStorage.setItem(THEMES_KEY, JSON.stringify(themes));
};

export const localThemeService: ThemeService = {
  async listThemes() {
    return readThemes();
  },

  async getTheme(id: string) {
    const themes = readThemes();
    return themes.find((t) => t.id === id) ?? null;
  },

  async getActiveTheme() {
    const themes = readThemes();
    return themes.find((t) => t.isActive) ?? null;
  },

  async createTheme(input: SaveThemeInput) {
    const validated = SaveThemeInputSchema.parse(input);
    const themes = readThemes();
    
    const newTheme: CustomTheme = {
      id: crypto.randomUUID(),
      name: validated.name,
      userId: "default-user",
      fontFamily: validated.fontFamily,
      colors: validated.colors,
      iconColors: validated.iconColors,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: false
    };

    writeThemes([...themes, newTheme]);
    return newTheme;
  },

  async updateTheme(id: string, input: Partial<SaveThemeInput>) {
    const validated = SaveThemeInputSchema.partial().parse(input);
    const themes = readThemes();
    const existing = themes.find((t) => t.id === id);

    if (!existing) return null;

    const updated: CustomTheme = {
      id: existing.id,
      userId: existing.userId,
      createdAt: existing.createdAt,
      isActive: existing.isActive,
      name: validated.name ?? existing.name,
      fontFamily: validated.fontFamily ?? existing.fontFamily,
      colors: validated.colors ?? existing.colors,
      iconColors: validated.iconColors ?? existing.iconColors,
      updatedAt: new Date().toISOString()
    };

    const updatedThemes = themes.map((t) => (t.id === id ? updated : t));
    writeThemes(updatedThemes);
    return updated;
  },

  async deleteTheme(id: string) {
    const themes = readThemes();
    const theme = themes.find((t) => t.id === id);

    if (!theme) return false;
    if (theme.isActive) return false; // Don't delete active theme

    const filtered = themes.filter((t) => t.id !== id);
    writeThemes(filtered);
    return true;
  },

  async activateTheme(id: string) {
    const themes = readThemes();
    const theme = themes.find((t) => t.id === id);

    if (!theme) return null;

    // Deactivate all themes
    const updated = themes.map((t) => ({
      ...t,
      isActive: t.id === id,
      updatedAt: t.id === id ? new Date().toISOString() : t.updatedAt
    }));

    writeThemes(updated);
    return updated.find((t) => t.id === id) ?? null;
  }
};