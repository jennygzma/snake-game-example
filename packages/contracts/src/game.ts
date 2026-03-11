import { z } from "zod";

export const gameSettingsSchema = z.object({
  speed: z.number().int().min(1).max(30),
  gridSize: z.number().int().min(8).max(64)
});

export const runRecordInputSchema = z.object({
  score: z.number().int().min(0),
  durationMs: z.number().int().min(0),
  endedAt: z.string().datetime(),
  variationId: z.string().uuid().optional()
});

export const runRecordSchema = runRecordInputSchema.extend({
  id: z.string().min(1),
  userId: z.string().min(1),
  variationId: z.string().uuid().optional()
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
  variationId: z.string().uuid().optional(),
  variationName: z.string().optional()
});

export const leaderboardResponseSchema = z.object({
  entries: z.array(leaderboardEntrySchema)
});

export type GameSettings = z.infer<typeof gameSettingsSchema>;
export type RunRecordInput = z.infer<typeof runRecordInputSchema>;
export type RunRecord = z.infer<typeof runRecordSchema>;
export type HighScoreResponse = z.infer<typeof highScoreResponseSchema>;
export type RecentRunsResponse = z.infer<typeof recentRunsResponseSchema>;
export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;
export type LeaderboardResponse = z.infer<typeof leaderboardResponseSchema>;

export const DEFAULT_SETTINGS: GameSettings = {
  speed: 8,
  gridSize: 20
};
