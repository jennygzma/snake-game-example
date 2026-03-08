import type {
  ActiveThemeResponse,
  CreateThemeInput,
  CustomTheme,
  ThemeListResponse,
  UpdateThemeInput
} from "@snake/contracts";

export interface ThemeService {
  // Get all themes
  getThemes(): Promise<ThemeListResponse>;

  // Get a specific theme by ID
  getTheme(id: string): Promise<CustomTheme>;

  // Get the active theme
  getActiveTheme(): Promise<ActiveThemeResponse>;

  // Create a new theme
  createTheme(input: CreateThemeInput): Promise<CustomTheme>;

  // Update an existing theme
  updateTheme(id: string, input: UpdateThemeInput): Promise<CustomTheme>;

  // Delete a theme
  deleteTheme(id: string): Promise<void>;

  // Activate a theme
  activateTheme(id: string): Promise<CustomTheme>;
}