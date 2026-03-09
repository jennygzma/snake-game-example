import type {
  CustomTheme,
  SaveThemeInput,
  ThemeResponse,
  ThemesListResponse,
  ActiveThemeResponse
} from "@snake/contracts";

export interface ThemeService {
  getAllThemes(): Promise<ThemesListResponse>;
  getThemeById(id: string): Promise<ThemeResponse | null>;
  getActiveTheme(): Promise<ActiveThemeResponse>;
  createTheme(input: SaveThemeInput): Promise<ThemeResponse>;
  updateTheme(id: string, updates: Partial<SaveThemeInput>): Promise<ThemeResponse | null>;
  deleteTheme(id: string): Promise<boolean>;
  setActiveTheme(id: string): Promise<ThemeResponse | null>;
}