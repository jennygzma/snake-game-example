import { z } from "zod";
import { themeColorsSchema, themeIconColorsSchema } from "./theme.js";
import { powerupTypeSchema } from "./game.js";

// Creator profile info (joined from profiles table)
export const creatorProfileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  avatarBase64: z.string().optional()
});

// Shared Theme Schemas
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

// Shared Variation Schemas
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

// Share Action Inputs
export const shareThemeInputSchema = z.object({
  themeId: z.string().min(1),
  description: z.string().max(500).optional()
});

export const shareVariationInputSchema = z.object({
  variationId: z.string().min(1),
  description: z.string().max(500).optional()
});

// Hub Search/Browse Parameters
export const hubSearchParamsSchema = z.object({
  query: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  sortBy: z.enum(["recent", "popular", "favorites"]).default("recent"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
});

// Pagination Metadata
export const paginationMetaSchema = z.object({
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  totalPages: z.number().int().min(0)
});

// Hub Browse Responses
export const hubThemesResponseSchema = z.object({
  themes: z.array(sharedThemeWithCreatorSchema),
  pagination: paginationMetaSchema
});

export const hubVariationsResponseSchema = z.object({
  variations: z.array(sharedVariationWithCreatorSchema),
  pagination: paginationMetaSchema
});

// Single Item Responses
export const sharedThemeResponseSchema = z.object({
  theme: sharedThemeWithCreatorSchema
});

export const sharedVariationResponseSchema = z.object({
  variation: sharedVariationWithCreatorSchema
});

// Share/Unshare Action Responses
export const shareResponseSchema = z.object({
  sharedId: z.string().min(1),
  message: z.string()
});

export const unshareResponseSchema = z.object({
  message: z.string()
});

// Favorite Action Responses
export const favoriteResponseSchema = z.object({
  message: z.string(),
  favoriteCount: z.number().int().min(0)
});

export const unfavoriteResponseSchema = z.object({
  message: z.string(),
  favoriteCount: z.number().int().min(0)
});

// User Favorites Response
export const userFavoritesResponseSchema = z.object({
  themes: z.array(sharedThemeWithCreatorSchema),
  variations: z.array(sharedVariationWithCreatorSchema)
});

// Copy to Local Responses (return local copy IDs)
export const copyThemeToLocalResponseSchema = z.object({
  localThemeId: z.string().min(1),
  message: z.string()
});

export const copyVariationToLocalResponseSchema = z.object({
  localVariationId: z.string().min(1),
  message: z.string()
});

// Type Exports
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
export type SharedThemeResponse = z.infer<typeof sharedThemeResponseSchema>;
export type SharedVariationResponse = z.infer<typeof sharedVariationResponseSchema>;
export type ShareResponse = z.infer<typeof shareResponseSchema>;
export type UnshareResponse = z.infer<typeof unshareResponseSchema>;
export type FavoriteResponse = z.infer<typeof favoriteResponseSchema>;
export type UnfavoriteResponse = z.infer<typeof unfavoriteResponseSchema>;
export type UserFavoritesResponse = z.infer<typeof userFavoritesResponseSchema>;
export type CopyThemeToLocalResponse = z.infer<typeof copyThemeToLocalResponseSchema>;
export type CopyVariationToLocalResponse = z.infer<typeof copyVariationToLocalResponseSchema>;