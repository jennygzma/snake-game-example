import { z } from "zod";
import { themeColorsSchema, themeIconColorsSchema } from "./theme";
import { powerupTypeSchema } from "./game";

// Creator profile info (joined from profiles table)
export const creatorInfoSchema = z.object({
  profileId: z.string().min(1),
  profileName: z.string().min(1),
  avatarBase64: z.string().optional()
});

// Shared Theme schemas
export const shareThemeInputSchema = z.object({
  themeId: z.string().min(1), // Local theme to share
  description: z.string().max(500).optional()
});

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
  creator: creatorInfoSchema,
  isFavorited: z.boolean() // Whether current user favorited this
});

// Shared Variation schemas
export const shareVariationInputSchema = z.object({
  variationId: z.string().min(1), // Local variation to share
  description: z.string().max(500).optional()
});

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
  creator: creatorInfoSchema,
  isFavorited: z.boolean() // Whether current user favorited this
});

// Search and filter parameters
export const hubSearchParamsSchema = z.object({
  query: z.string().optional(), // Search by name/description
  difficulty: z.enum(["easy", "medium", "hard"]).optional(), // For variations only
  sortBy: z.enum(["newest", "popular", "favorites"]).optional().default("newest"),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20)
});

// Browse responses with pagination
export const hubThemesResponseSchema = z.object({
  themes: z.array(sharedThemeWithCreatorSchema),
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  hasMore: z.boolean()
});

export const hubVariationsResponseSchema = z.object({
  variations: z.array(sharedVariationWithCreatorSchema),
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  hasMore: z.boolean()
});

// Single item responses
export const sharedThemeResponseSchema = z.object({
  theme: sharedThemeWithCreatorSchema
});

export const sharedVariationResponseSchema = z.object({
  variation: sharedVariationWithCreatorSchema
});

// Share/unshare responses
export const shareResponseSchema = z.object({
  sharedId: z.string().min(1),
  message: z.string()
});

export const unshareResponseSchema = z.object({
  success: z.boolean(),
  message: z.string()
});

// Favorite responses
export const favoriteResponseSchema = z.object({
  success: z.boolean(),
  favoriteCount: z.number().int().min(0)
});

// Copy responses (returns the new local copy)
export const copyThemeResponseSchema = z.object({
  themeId: z.string().min(1),
  message: z.string()
});

export const copyVariationResponseSchema = z.object({
  variationId: z.string().min(1),
  message: z.string()
});

// User favorites list
export const userFavoritesSchema = z.object({
  themes: z.array(z.string()), // Array of shared_theme_ids
  variations: z.array(z.string()) // Array of shared_variation_ids
});

// Type exports
export type CreatorInfo = z.infer<typeof creatorInfoSchema>;
export type ShareThemeInput = z.infer<typeof shareThemeInputSchema>;
export type SharedTheme = z.infer<typeof sharedThemeSchema>;
export type SharedThemeWithCreator = z.infer<typeof sharedThemeWithCreatorSchema>;
export type ShareVariationInput = z.infer<typeof shareVariationInputSchema>;
export type SharedVariation = z.infer<typeof sharedVariationSchema>;
export type SharedVariationWithCreator = z.infer<typeof sharedVariationWithCreatorSchema>;
export type HubSearchParams = z.infer<typeof hubSearchParamsSchema>;
export type HubThemesResponse = z.infer<typeof hubThemesResponseSchema>;
export type HubVariationsResponse = z.infer<typeof hubVariationsResponseSchema>;
export type SharedThemeResponse = z.infer<typeof sharedThemeResponseSchema>;
export type SharedVariationResponse = z.infer<typeof sharedVariationResponseSchema>;
export type ShareResponse = z.infer<typeof shareResponseSchema>;
export type UnshareResponse = z.infer<typeof unshareResponseSchema>;
export type FavoriteResponse = z.infer<typeof favoriteResponseSchema>;
export type CopyThemeResponse = z.infer<typeof copyThemeResponseSchema>;
export type CopyVariationResponse = z.infer<typeof copyVariationResponseSchema>;
export type UserFavorites = z.infer<typeof userFavoritesSchema>;