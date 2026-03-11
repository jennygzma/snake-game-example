import {
  gameSettingsSchema,
  highScoreResponseSchema,
  leaderboardResponseSchema,
  profileSchema,
  recentRunsResponseSchema,
  runRecordInputSchema,
  runRecordSchema,
  type GameSettings,
  type HighScoreResponse,
  type LeaderboardResponse,
  type Profile,
  type RecentRunsResponse,
  type RunRecord,
  type RunRecordInput
} from "@snake/contracts";
import type { ZodType } from "zod";
import type { GameService } from "../gameService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const request = async <T>(path: string, schema: ZodType<T>, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return schema.parse(json);
};

export const apiGameService: GameService = {
  getProfile() {
    return request<Profile>("/v1/profile", profileSchema);
  },

  getHighScore() {
    return request<HighScoreResponse>("/v1/scores/high", highScoreResponseSchema);
  },

  getLeaderboard(limit: number, scope: "active" | "global" = "active") {
    return request<LeaderboardResponse>(
      `/v1/leaderboard?limit=${Math.max(1, limit)}&scope=${scope}`,
      leaderboardResponseSchema
    );
  },

  saveRun(run: RunRecordInput) {
    const payload = runRecordInputSchema.parse(run);
    return request<RunRecord>("/v1/runs", runRecordSchema, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  listRecentRuns(limit: number) {
    return request<RecentRunsResponse>(
      `/v1/runs?limit=${Math.max(1, limit)}`,
      recentRunsResponseSchema
    );
  },

  getSettings() {
    return request<GameSettings>("/v1/settings", gameSettingsSchema);
  },

  saveSettings(settings: GameSettings) {
    const payload = gameSettingsSchema.parse(settings);
    return request<GameSettings>("/v1/settings", gameSettingsSchema, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  }
};
