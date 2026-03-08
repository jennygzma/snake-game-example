import { z } from "zod";

// Schema for all customizable theme colors matching gameTokens structure
export const ThemeColorsSchema = z.object({
  bg: z.string(),
  panel: z.string(),
  panelBorder: z.string(),
  text: z.string(),
  textMuted: z.string(),
  snake: z.string(),
  snakeHead: z.string(),
  food: z.string(),
  boardGrid: z.string(),
  boardBg: z.string(),
  action: z.string(),
  actionHover: z.string(),
  actionText: z.string(),
  pause: z.string(),
  pauseHover: z.string(),
  pauseText: z.string(),
  neutral: z.string(),
  neutralHover: z.string(),
  neutralText: z.string(),
  danger: z.string(),
  dangerHover: z.string(),
  dangerText: z.string()
});

// Schema for icon-specific color overrides
export const ThemeIconColorsSchema = z.object({
  default: z.string(),
  play: z.string().optional(),
  pause: z.string().optional(),
  reset: z.string().optional(),
  settings: z.string().optional(),
  stats: z.string().optional(),
  game: z.string().optional()
});

// Complete custom theme schema
export const CustomThemeSchema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
  fontFamily: z.string(),
  colors: ThemeColorsSchema,
  iconColors: ThemeIconColorsSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  isActive: z.boolean()
});

// Input schema for creating/updating themes
export const SaveThemeInputSchema = z.object({
  name: z.string().min(1).max(100),
  fontFamily: z.string(),
  colors: ThemeColorsSchema,
  iconColors: ThemeIconColorsSchema
});

// Response schema for theme list
export const ThemeListResponseSchema = z.object({
  themes: z.array(CustomThemeSchema)
});

// Response schema for single theme
export const ThemeResponseSchema = z.object({
  theme: CustomThemeSchema
});

// Response schema for active theme
export const ActiveThemeResponseSchema = z.object({
  theme: CustomThemeSchema.nullable()
});

// TypeScript types inferred from schemas
export type ThemeColors = z.infer<typeof ThemeColorsSchema>;
export type ThemeIconColors = z.infer<typeof ThemeIconColorsSchema>;
export type CustomTheme = z.infer<typeof CustomThemeSchema>;
export type SaveThemeInput = z.infer<typeof SaveThemeInputSchema>;
export type ThemeListResponse = z.infer<typeof ThemeListResponseSchema>;
export type ThemeResponse = z.infer<typeof ThemeResponseSchema>;
export type ActiveThemeResponse = z.infer<typeof ActiveThemeResponseSchema>;