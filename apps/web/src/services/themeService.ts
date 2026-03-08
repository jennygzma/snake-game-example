import type {
  CustomTheme,
  SaveThemeInput,
  ThemeListResponse,
  ThemeResponse,
  ActiveThemeResponse
} from "@snake/contracts";

export interface ThemeService {
  // List all themes
  listThemes(): Promise<CustomTheme[]>;

  // Get a specific theme by ID
  getTheme(id: string): Promise<CustomTheme | null>;

  // Get the active theme
  getActiveTheme(): Promise<CustomTheme | null>;

  // Create a new theme
  createTheme(input: SaveThemeInput): Promise<CustomTheme>;

  // Update an existing theme
  updateTheme(id: string, input: Partial<SaveThemeInput>): Promise<CustomTheme | null>;

  // Delete a theme
  deleteTheme(id: string): Promise<boolean>;

  // Activate a theme
  activateTheme(id: string): Promise<CustomTheme | null>;
}