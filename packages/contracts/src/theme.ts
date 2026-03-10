import { z } from "zod";

// Theme color validation - hex color format
const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color (e.g., #FFFFFF)");
const rgbaColorSchema = z.string().regex(/^rgba?\([^)]+\)$/, "Must be a valid rgba color");
const colorSchema = z.union([hexColorSchema, rgbaColorSchema]);

// All customizable game token colors
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

// Icon-specific colors (optional overrides)
export const themeIconColorsSchema = z.object({
  default: colorSchema,
  play: colorSchema.optional(),
  pause: colorSchema.optional(),
  reset: colorSchema.optional(),
  settings: colorSchema.optional(),
  stats: colorSchema.optional()
});

// Input for saving a new theme
export const saveThemeInputSchema = z.object({
  name: z.string().min(1).max(50),
  fontFamily: z.string().min(1).max(100),
  colors: themeColorsSchema,
  iconColors: themeIconColorsSchema
});

// Full theme object with metadata
export const customThemeSchema = saveThemeInputSchema.extend({
  id: z.string().min(1),
  userId: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  isActive: z.boolean()
});

// Response schemas for API endpoints
export const themesListResponseSchema = z.object({
  themes: z.array(customThemeSchema)
});

export const themeResponseSchema = z.object({
  theme: customThemeSchema
});

export const activeThemeResponseSchema = z.object({
  theme: customThemeSchema.nullable()
});

// Type exports
export type ThemeColors = z.infer<typeof themeColorsSchema>;
export type ThemeIconColors = z.infer<typeof themeIconColorsSchema>;
export type SaveThemeInput = z.infer<typeof saveThemeInputSchema>;
export type CustomTheme = z.infer<typeof customThemeSchema>;
export type ThemesListResponse = z.infer<typeof themesListResponseSchema>;
export type ThemeResponse = z.infer<typeof themeResponseSchema>;
export type ActiveThemeResponse = z.infer<typeof activeThemeResponseSchema>;