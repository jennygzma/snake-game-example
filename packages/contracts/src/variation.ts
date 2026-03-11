import { z } from "zod";
import { powerupTypeSchema } from "./powerup";

export const difficultyLevelSchema = z.enum(["easy", "medium", "hard"]);

export const gameVariationInputSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  difficulty: difficultyLevelSchema,
  
  // Visual customization
  snakeHeadImage: z.string().optional(), // base64
  
  // Powerup configuration
  maxConcurrentFoods: z.number().int().min(1).max(5),
  enabledPowerups: z.array(powerupTypeSchema).min(1).max(10),
  
  // Game rules
  baseSpeed: z.number().int().min(1).max(30),
  baseGridSize: z.number().int().min(8).max(64),
  
  isPublic: z.boolean().default(false)
});

export const gameVariationSchema = gameVariationInputSchema.extend({
  id: z.string().uuid(),
  profileId: z.string(),
  usageCount: z.number().int().min(0).default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type DifficultyLevel = z.infer<typeof difficultyLevelSchema>;
export type GameVariationInput = z.infer<typeof gameVariationInputSchema>;
export type GameVariation = z.infer<typeof gameVariationSchema>;

// Response schemas
export const variationResponseSchema = z.object({
  variation: gameVariationSchema
});

export const variationsListResponseSchema = z.object({
  variations: z.array(gameVariationSchema)
});

export type VariationResponse = z.infer<typeof variationResponseSchema>;
export type VariationsListResponse = z.infer<typeof variationsListResponseSchema>;