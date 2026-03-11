import { z } from "zod";
import { themeColorsSchema, themeIconColorsSchema } from "./theme";
import { powerupTypeSchema } from "./game";

// ============================================================================
// Shared Theme Schemas
// ============================================================================

export const sharedThemeSchema = z.object({
  id: z.string().min(1),
  creatorProfileId: z.string().min(1),
  name: z.string().min(1).max(50),
  description: z.string().max(500).optional(),
  fontFamily: z.string().min(1).max(100),
  colors: themeColorsSchema,
  iconColors: themeIconColorsSchema,
  favoriteCount: z.number().int().min(0).default(0),
  usageCount: z.number().int().min(0).default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const shareThemeInputSchema = z.object({
  themeId: z.string().min(1),
  description: z.string().max(500).optional()
});

export const updateSharedThemeInputSchema = z.object({
  description: z.string().max(500).optional()
});

// ============================================================================
// Shared Variation Schemas
// ============================================================================

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
  favoriteCount: z.number().int().min(0).default(0),
  usageCount: z.number().int().min(0).default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const shareVariationInputSchema = z.object({
  variationId: z.string().min(1),
  description: z.string().max(500).optional()
});

export const updateSharedVariationInputSchema = z.object({
  description: z.string().max(500).optional()
});

// ============================================================================
// Hub Item with Creator Info
// ============================================================================

export const hubCreatorSchema = z.object({
  profileId: z.string().min(1),
  profileName: z.string().min(1),
  profileAvatar: z.string().optional()
});

export const hubThemeWithCreatorSchema = sharedThemeSchema.extend({
  creator: hubCreatorSchema,
  isFavorited: z.boolean().default(false)
});

export const hubVariationWithCreatorSchema = sharedVariationSchema.extend({
  creator: hubCreatorSchema,
  isFavorited: z.boolean().default(false)
});

// ============================================================================
// Discovery & Search
// ============================================================================

export const hubSortBySchema = z.enum([
  "recent",
  "popular",
  "favorites"
]);

export const hubSearchParamsSchema = z.object({
  query: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  sortBy: hubSortBySchema.default("recent"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20)
});

export const hubThemesResponseSchema = z.object({
  themes: z.array(hubThemeWithCreatorSchema),
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  hasMore: z.boolean()
});

export const hubVariationsResponseSchema = z.object({
  variations: z.array(hubVariationWithCreatorSchema),
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  hasMore: z.boolean()
});

// ============================================================================
// Actions
// ============================================================================

export const shareResponseSchema = z.object({
  sharedId: z.string().min(1),
  message: z.string().optional()
});

export const copyToLocalResponseSchema = z.object({
  localId: z.string().min(1),
  message: z.string().optional()
});

export const favoritesResponseSchema = z.object({
  themes: z.array(hubThemeWithCreatorSchema),
  variations: z.array(hubVariationWithCreatorSchema)
});

// ============================================================================
// Type Exports
// ============================================================================

export type SharedTheme = z.infer<typeof sharedThemeSchema>;
export type ShareThemeInput = z.infer<typeof shareThemeInputSchema>;
export type UpdateSharedThemeInput = z.infer<typeof updateSharedThemeInputSchema>;

export type SharedVariation = z.infer<typeof sharedVariationSchema>;
export type ShareVariationInput = z.infer<typeof shareVariationInputSchema>;
export type UpdateSharedVariationInput = z.infer<typeof updateSharedVariationInputSchema>;

export type HubCreator = z.infer<typeof hubCreatorSchema>;
export type HubThemeWithCreator = z.infer<typeof hubThemeWithCreatorSchema>;
export type HubVariationWithCreator = z.infer<typeof hubVariationWithCreatorSchema>;

export type HubSortBy = z.infer<typeof hubSortBySchema>;
export type HubSearchParams = z.infer<typeof hubSearchParamsSchema>;
export type HubThemesResponse = z.infer<typeof hubThemesResponseSchema>;
export type HubVariationsResponse = z.infer<typeof hubVariationsResponseSchema>;

export type ShareResponse = z.infer<typeof shareResponseSchema>;
export type CopyToLocalResponse = z.infer<typeof copyToLocalResponseSchema>;
export type FavoritesResponse = z.infer<typeof favoritesResponseSchema>;