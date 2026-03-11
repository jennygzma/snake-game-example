import { z } from "zod";

// Powerup Type Definitions
export const powerupEffectSchema = z.enum([
  "speed_increase",
  "speed_decrease",
  "add_blocks",
  "subtract_blocks",
  "double_points"
]);

export const powerupTypeSchema = z.object({
  effect: powerupEffectSchema,
  value: z.number(),
  color: z.string(),
  image: z.string().optional()
});

// Game Variation Definitions
export const gameVariationInputSchema = z.object({
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
  }).optional()
});

export const gameVariationSchema = gameVariationInputSchema.extend({
  id: z.string().min(1),
  profileId: z.string().min(1),
  usageCount: z.number().int().min(0).default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const gameVariationResponseSchema = z.object({
  variation: gameVariationSchema
});

export const gameVariationListResponseSchema = z.object({
  variations: z.array(gameVariationSchema)
});

// Game Settings (kept for backward compatibility)
export const gameSettingsSchema = z.object({
  speed: z.number().int().min(1).max(30),
  gridSize: z.number().int().min(8).max(64),
  variationId: z.string().optional()
});

// Run Records with Variation Support
export const runRecordInputSchema = z.object({
  score: z.number().int().min(0),
  durationMs: z.number().int().min(0),
  endedAt: z.string().datetime(),
  variationId: z.string().optional()
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
  variationName: z.string().optional()
});

export const leaderboardResponseSchema = z.object({
  entries: z.array(leaderboardEntrySchema)
});

export const leaderboardQuerySchema = z.object({
  variationId: z.string().optional()
});

// Type exports
export type PowerupEffect = z.infer<typeof powerupEffectSchema>;
export type PowerupType = z.infer<typeof powerupTypeSchema>;
export type GameVariationInput = z.infer<typeof gameVariationInputSchema>;
export type GameVariation = z.infer<typeof gameVariationSchema>;
export type GameVariationResponse = z.infer<typeof gameVariationResponseSchema>;
export type GameVariationListResponse = z.infer<typeof gameVariationListResponseSchema>;
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

// Default Classic Variation Template
export const DEFAULT_CLASSIC_VARIATION: Omit<GameVariationInput, "powerupTypes"> & { powerupTypes: PowerupType[] } = {
  name: "Classic",
  description: "Traditional snake game with standard rules",
  difficulty: "medium",
  baseSpeed: 8,
  gridSize: 20,
  maxConcurrentFoods: 1,
  powerupTypes: [
    {
      effect: "double_points",
      value: 1,
      color: "#87ae73" // green from design system
    }
  ]
};