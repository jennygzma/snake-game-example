import type {
  CustomTheme,
  SaveThemeInput,
  ThemesListResponse,
  ThemeResponse,
  ActiveThemeResponse
} from "@snake/contracts";

export interface ThemeService {
  /**
   * List all themes for the user
   */
  listThemes(): Promise<ThemesListResponse>;

  /**
   * Get a specific theme by ID
   */
  getTheme(themeId: string): Promise<ThemeResponse | null>;

  /**
   * Get the active theme for the user
   */
  getActiveTheme(): Promise<ActiveThemeResponse>;

  /**
   * Create a new theme
   */
  createTheme(input: SaveThemeInput): Promise<ThemeResponse>;

  /**
   * Update an existing theme
   */
  updateTheme(themeId: string, input: SaveThemeInput): Promise<ThemeResponse | null>;

  /**
   * Delete a theme
   */
  deleteTheme(themeId: string): Promise<boolean>;

  /**
   * Activate a theme (and deactivate all others)
   */
  activateTheme(themeId: string): Promise<ThemeResponse | null>;
}