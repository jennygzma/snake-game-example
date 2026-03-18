import {
  saveThemeInputSchema,
  themesListResponseSchema,
  themeResponseSchema,
  activeThemeResponseSchema,
  profileSchema,
  type CustomTheme,
  type SaveThemeInput,
  type ThemesListResponse,
  type ThemeResponse,
  type ActiveThemeResponse
} from "@snake/contracts";
import type { ThemeService } from "../themeService";

const THEMES_KEY = "snake.themes";
const PROFILES_KEY = "snake.profiles";

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

const getActiveProfileId = (): string => {
  const raw = localStorage.getItem(PROFILES_KEY);
  if (!raw) throw new Error("No active profile found");

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("No active profile found");
    const active = parsed
      .map((value) => profileSchema.safeParse(value))
      .filter((result): result is { success: true; data: ReturnType<typeof profileSchema.parse> } => result.success)
      .map((result) => result.data)
      .find((profile) => profile.isActive);
    if (!active) throw new Error("No active profile found");
    return active.id;
  } catch {
    throw new Error("No active profile found");
  }
};

export const localThemeService: ThemeService = {
  async listThemes() {
    const activeProfileId = getActiveProfileId();
    const themes = readThemes().filter((theme) => theme.userId === activeProfileId);
    return themesListResponseSchema.parse({ themes }) satisfies ThemesListResponse;
  },

  async getTheme(themeId: string) {
    const activeProfileId = getActiveProfileId();
    const themes = readThemes();
    const theme = themes.find((t) => t.id === themeId && t.userId === activeProfileId);
    if (!theme) return null;
    return themeResponseSchema.parse({ theme }) satisfies ThemeResponse;
  },

  async getActiveTheme() {
    const activeProfileId = getActiveProfileId();
    const themes = readThemes();
    const theme = themes.find((t) => t.userId === activeProfileId && t.isActive) ?? null;
    return activeThemeResponseSchema.parse({ theme }) satisfies ActiveThemeResponse;
  },

  async createTheme(input: SaveThemeInput) {
    const validated = saveThemeInputSchema.parse(input);
    const activeProfileId = getActiveProfileId();
    const now = new Date().toISOString();

    const theme: CustomTheme = {
      id: crypto.randomUUID(),
      userId: activeProfileId,
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
    const activeProfileId = getActiveProfileId();
    const themes = readThemes();
    const existing = themes.find((t) => t.id === themeId && t.userId === activeProfileId);

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
    const activeProfileId = getActiveProfileId();
    const themes = readThemes();
    const filtered = themes.filter((t) => !(t.id === themeId && t.userId === activeProfileId));

    if (filtered.length === themes.length) {
      return false;
    }

    writeThemes(filtered);
    return true;
  },

  async activateTheme(themeId: string) {
    const activeProfileId = getActiveProfileId();
    const themes = readThemes();
    const target = themes.find((t) => t.id === themeId && t.userId === activeProfileId);
    if (!target) return null;

    const updatedThemes = themes.map((t) =>
      t.userId === activeProfileId ? { ...t, isActive: t.id === themeId } : t
    );
    writeThemes(updatedThemes);

    const activatedTheme = updatedThemes.find((t) => t.id === themeId) ?? null;
    return themeResponseSchema.parse({
      theme: activatedTheme
    }) satisfies ThemeResponse;
  }
};
