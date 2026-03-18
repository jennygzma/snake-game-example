import { z } from "zod";
import { themeColorsSchema, themeIconColorsSchema } from "./theme";
import { powerupTypeSchema } from "./game";

// Creator profile information
export const creatorProfileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  avatarBase64: z.string().optional()
});

// Shared Theme schemas
export const sharedThemeSchema = z.object({
  id: z.string().min(1),
  creatorProfileId: z.string().min(1),
  name: z.string().min(1).max(50),
  description: z.string().max(500).optional(),
  fontFamily: z.string().min(1).max(100),
  colors: themeColorsSchema,
  iconColors: themeIconColorsSchema,
  favoriteCount: z.number().int().min(0),
  usageCount: z.number().int().min(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const sharedThemeWithCreatorSchema = sharedThemeSchema.extend({
  creator: creatorProfileSchema
});

// Shared Variation schemas
export const sharedVariationSchema = z.object({
  id: z.string().min(1),
  creatorProfileId: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  baseSpeed: z.number().int().min(1).max(30),
  gridSize: z.number().int().min(8).max(64),
  maxConcurrentFoods: z.number().int().min(1).max(10),
  snakeHeadImage: z.string().optional(),
  powerupTypes: z.array(powerupTypeSchema),
  customColors: z.object({
    snake: z.string().optional(),
    snakeHead: z.string().optional(),
    boardBg: z.string().optional(),
    boardGrid: z.string().optional()
  }).optional(),
  favoriteCount: z.number().int().min(0),
  usageCount: z.number().int().min(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const sharedVariationWithCreatorSchema = sharedVariationSchema.extend({
  creator: creatorProfileSchema
});

// Input schemas for sharing
export const shareThemeInputSchema = z.object({
  themeId: z.string().min(1),
  description: z.string().max(500).optional()
});

export const shareVariationInputSchema = z.object({
  variationId: z.string().min(1),
  description: z.string().max(500).optional()
});

// Hub search and filtering
export const hubSearchParamsSchema = z.object({
  query: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  sortBy: z.enum(["newest", "popular", "mostUsed"]).default("newest"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
});

// Pagination metadata
export const paginationMetaSchema = z.object({
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  totalPages: z.number().int().min(0)
});

// Hub response schemas
export const hubThemesResponseSchema = z.object({
  themes: z.array(sharedThemeWithCreatorSchema),
  meta: paginationMetaSchema
});

export const hubVariationsResponseSchema = z.object({
  variations: z.array(sharedVariationWithCreatorSchema),
  meta: paginationMetaSchema
});

// Single item responses
export const hubThemeResponseSchema = z.object({
  theme: sharedThemeWithCreatorSchema
});

export const hubVariationResponseSchema = z.object({
  variation: sharedVariationWithCreatorSchema
});

// Action response schemas
export const shareResponseSchema = z.object({
  sharedId: z.string().min(1),
  message: z.string()
});

export const favoriteResponseSchema = z.object({
  localId: z.string().min(1),
  message: z.string()
});

export const copyToLocalResponseSchema = z.object({
  localId: z.string().min(1),
  name: z.string().min(1)
});

// User favorites
export const userFavoritesResponseSchema = z.object({
  themeIds: z.array(z.string()),
  variationIds: z.array(z.string())
});

// Type exports
export type CreatorProfile = z.infer<typeof creatorProfileSchema>;
export type SharedTheme = z.infer<typeof sharedThemeSchema>;
export type SharedThemeWithCreator = z.infer<typeof sharedThemeWithCreatorSchema>;
export type SharedVariation = z.infer<typeof sharedVariationSchema>;
export type SharedVariationWithCreator = z.infer<typeof sharedVariationWithCreatorSchema>;
export type ShareThemeInput = z.infer<typeof shareThemeInputSchema>;
export type ShareVariationInput = z.infer<typeof shareVariationInputSchema>;
export type HubSearchParams = z.infer<typeof hubSearchParamsSchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type HubThemesResponse = z.infer<typeof hubThemesResponseSchema>;
export type HubVariationsResponse = z.infer<typeof hubVariationsResponseSchema>;
export type HubThemeResponse = z.infer<typeof hubThemeResponseSchema>;
export type HubVariationResponse = z.infer<typeof hubVariationResponseSchema>;
export type ShareResponse = z.infer<typeof shareResponseSchema>;
export type FavoriteResponse = z.infer<typeof favoriteResponseSchema>;
export type CopyToLocalResponse = z.infer<typeof copyToLocalResponseSchema>;
export type UserFavoritesResponse = z.infer<typeof userFavoritesResponseSchema>;