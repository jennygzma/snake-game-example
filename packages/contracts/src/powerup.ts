import { z } from "zod";

export const powerupEffectSchema = z.enum([
  "speed_increase",
  "speed_decrease",
  "add_blocks",
  "subtract_blocks"
]);

export const powerupTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  effect: powerupEffectSchema,
  effectValue: z.number().positive(), // 1.5 for speed multiplier, 2 for blocks, etc.
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  image: z.string().optional() // base64 data URL
});

export type PowerupEffect = z.infer<typeof powerupEffectSchema>;
export type PowerupType = z.infer<typeof powerupTypeSchema>;