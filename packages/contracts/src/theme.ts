import { z } from "zod";

// Color schema for all theme colors
export const themeColorsSchema = z.object({
  // Background colors
  bg: z.string(),
  panel: z.string(),
  panelBorder: z.string(),
  boardGrid: z.string(),
  boardBg: z.string(),
  
  // Text colors
  text: z.string(),
  textMuted: z.string(),
  
  // Game element colors
  snake: z.string(),
  snakeHead: z.string(),
  food: z.string(),
  
  // Action button colors
  action: z.string(),
  actionHover: z.string(),
  actionText: z.string(),
  
  // Pause button colors
  pause: z.string(),
  pauseHover: z.string(),
  pauseText: z.string(),
  
  // Neutral button colors
  neutral: z.string(),
  neutralHover: z.string(),
  neutralText: z.string(),
  
  // Danger button colors
  danger: z.string(),
  dangerHover: z.string(),
  dangerText: z.string()
});

export type ThemeColors = z.infer<typeof themeColorsSchema>;

// Icon colors schema
export const themeIconColorsSchema = z.object({
  default: z.string(),
  play: z.string().optional(),
  pause: z.string().optional(),
  replay: z.string().optional(),
  settings: z.string().optional(),
  stats: z.string().optional()
});

export type ThemeIconColors = z.infer<typeof themeIconColorsSchema>;

// Full custom theme schema
export const customThemeSchema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
  fontFamily: z.string(),
  colors: themeColorsSchema,
  iconColors: themeIconColorsSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  isActive: z.boolean()
});

export type CustomTheme = z.infer<typeof customThemeSchema>;

// Input schema for saving a theme (without id, userId, timestamps, isActive)
export const saveThemeInputSchema = z.object({
  name: z.string().min(1).max(50),
  fontFamily: z.string(),
  colors: themeColorsSchema,
  iconColors: themeIconColorsSchema
});

export type SaveThemeInput = z.infer<typeof saveThemeInputSchema>;

// Response schemas
export const themesListResponseSchema = z.object({
  themes: z.array(customThemeSchema)
});

export type ThemesListResponse = z.infer<typeof themesListResponseSchema>;

export const themeResponseSchema = z.object({
  theme: customThemeSchema
});

export type ThemeResponse = z.infer<typeof themeResponseSchema>;

export const activeThemeResponseSchema = z.object({
  theme: customThemeSchema.nullable()
});

export type ActiveThemeResponse = z.infer<typeof activeThemeResponseSchema>;