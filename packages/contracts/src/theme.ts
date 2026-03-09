import { z } from "zod";

// Color validation: must be valid hex color or rgba
const colorSchema = z.string().regex(/^(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|rgba?\([^)]+\))$/);

// Theme colors schema matching gameTokens.colors
export const themeColorsSchema = z.object({
  bg: colorSchema,
  panel: colorSchema,
  panelBorder: colorSchema,
  text: colorSchema,
  textMuted: colorSchema,
  snake: colorSchema,
  snakeHead: colorSchema,
  food: colorSchema,
  boardGrid: colorSchema,
  boardBg: colorSchema,
  action: colorSchema,
  actionHover: colorSchema,
  actionText: colorSchema,
  pause: colorSchema,
  pauseHover: colorSchema,
  pauseText: colorSchema,
  neutral: colorSchema,
  neutralHover: colorSchema,
  neutralText: colorSchema,
  danger: colorSchema,
  dangerHover: colorSchema,
  dangerText: colorSchema
});

// Icon colors for navigation and action icons
export const themeIconColorsSchema = z.object({
  default: colorSchema,
  home: colorSchema.optional(),
  stats: colorSchema.optional(),
  settings: colorSchema.optional(),
  play: colorSchema.optional(),
  pause: colorSchema.optional(),
  reset: colorSchema.optional()
});

// Full custom theme
export const customThemeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  userId: z.string().min(1),
  fontFamily: z.string().min(1).max(200),
  colors: themeColorsSchema,
  iconColors: themeIconColorsSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  isActive: z.boolean()
});

// Input for creating a new theme (without id, userId, timestamps, isActive)
export const createThemeInputSchema = z.object({
  name: z.string().min(1).max(100),
  fontFamily: z.string().min(1).max(200),
  colors: themeColorsSchema,
  iconColors: themeIconColorsSchema
});

// Input for updating a theme
export const updateThemeInputSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  fontFamily: z.string().min(1).max(200).optional(),
  colors: themeColorsSchema.optional(),
  iconColors: themeIconColorsSchema.optional()
});

// Response schemas
export const themeListResponseSchema = z.object({
  themes: z.array(customThemeSchema)
});

export const activeThemeResponseSchema = z.object({
  theme: customThemeSchema.nullable()
});

// Type exports
export type ThemeColors = z.infer<typeof themeColorsSchema>;
export type ThemeIconColors = z.infer<typeof themeIconColorsSchema>;
export type CustomTheme = z.infer<typeof customThemeSchema>;
export type CreateThemeInput = z.infer<typeof createThemeInputSchema>;
export type UpdateThemeInput = z.infer<typeof updateThemeInputSchema>;
export type ThemeListResponse = z.infer<typeof themeListResponseSchema>;
export type ActiveThemeResponse = z.infer<typeof activeThemeResponseSchema>;