import { z } from "zod";

// Powerup effect types
export const powerupEffectSchema = z.enum([
  "speed_increase",
  "speed_decrease",
  "points_multiplier",
  "length_increase",
  "length_decrease"
]);

// Powerup type schema
export const powerupTypeSchema = z.object({
  id: z.string().min(1),
  effect: powerupEffectSchema,
  value: z.number(), // Multiplier or absolute value depending on effect
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/), // Hex color
  image: z.string().optional() // Base64 image data
});

// Game variation difficulty levels
export const difficultySchema = z.enum(["easy", "medium", "hard", "custom"]);

// Game variation schema
export const gameVariationSchema = z.object({
  id: z.string().min(1),
  profileId: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  difficulty: difficultySchema,
  
  // Visual customization
  snakeHeadImage: z.string().optional(), // Base64 image
  boardBackgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  
  // Powerup configuration
  powerups: z.array(powerupTypeSchema),
  maxConcurrentFoods: z.number().int().min(1).max(10).default(1),
  
  // Game rules
  baseSpeed: z.number().int().min(1).max(30),
  gridSize: z.number().int().min(8).max(64),
  
  // Metadata
  usageCount: z.number().int().min(0).default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  isActive: z.boolean().default(false)
});

// Input schema for creating/updating variations (without generated fields)
export const gameVariationInputSchema = gameVariationSchema.omit({
  id: true,
  usageCount: true,
  createdAt: true,
  updatedAt: true,
  isActive: true
});

// Response schemas
export const gameVariationResponseSchema = z.object({
  variation: gameVariationSchema
});

export const gameVariationsResponseSchema = z.object({
  variations: z.array(gameVariationSchema)
});

// Existing game settings schema - now with optional variationId
export const gameSettingsSchema = z.object({
  speed: z.number().int().min(1).max(30),
  gridSize: z.number().int().min(8).max(64),
  variationId: z.string().optional() // Reference to active variation
});

// Updated run record schemas to include variationId
export const runRecordInputSchema = z.object({
  score: z.number().int().min(0),
  durationMs: z.number().int().min(0),
  endedAt: z.string().datetime(),
  variationId: z.string().optional() // Track which variation was used
});

export const runRecordSchema = runRecordInputSchema.extend({
  id: z.string().min(1),
  userId: z.string().min(1)
});

export const highScoreResponseSchema = z.object({
  highScore: z.number().int().min(0)
});

export const recentRunsResponseSchema = z.object({
  runs: z.array(runRecordSchema)
});

export const leaderboardEntrySchema = z.object({
  rank: z.number().int().min(1),
  userId: z.string().min(1),
  profileName: z.string().min(1),
  score: z.number().int().min(0),
  endedAt: z.string().datetime(),
  variationId: z.string().optional() // Track variation in leaderboard
});

export const leaderboardResponseSchema = z.object({
  entries: z.array(leaderboardEntrySchema)
});

// Leaderboard query params
export const leaderboardQuerySchema = z.object({
  profileId: z.string().optional(),
  variationId: z.string().optional(), // Filter by variation
  limit: z.number().int().min(1).max(100).default(10)
});

// Type exports
export type PowerupEffect = z.infer<typeof powerupEffectSchema>;
export type PowerupType = z.infer<typeof powerupTypeSchema>;
export type Difficulty = z.infer<typeof difficultySchema>;
export type GameVariation = z.infer<typeof gameVariationSchema>;
export type GameVariationInput = z.infer<typeof gameVariationInputSchema>;
export type GameVariationResponse = z.infer<typeof gameVariationResponseSchema>;
export type GameVariationsResponse = z.infer<typeof gameVariationsResponseSchema>;
export type GameSettings = z.infer<typeof gameSettingsSchema>;
export type RunRecordInput = z.infer<typeof runRecordInputSchema>;
export type RunRecord = z.infer<typeof runRecordSchema>;
export type HighScoreResponse = z.infer<typeof highScoreResponseSchema>;
export type RecentRunsResponse = z.infer<typeof recentRunsResponseSchema>;
export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;
export type LeaderboardResponse = z.infer<typeof leaderboardResponseSchema>;
export type LeaderboardQuery = z.infer<typeof leaderboardQuerySchema>;

export const DEFAULT_SETTINGS: GameSettings = {
  speed: 8,
  gridSize: 20
};