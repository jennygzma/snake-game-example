import {
  DEFAULT_SETTINGS,
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
import type { GameService } from "../gameService";

const PROFILE_KEY = "snake.profile";
const RUNS_KEY = "snake.runs";
const SETTINGS_KEY = "snake.settings";

const ensureProfile = (): Profile => {
  const raw = localStorage.getItem(PROFILE_KEY);
  if (raw) {
    const parsed = profileSchema.safeParse(JSON.parse(raw));
    if (parsed.success) {
      return parsed.data;
    }
  }

  const profile: Profile = {
    id: crypto.randomUUID(),
    name: "Player",
    avatarBase64: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
};

const readRuns = (): RunRecord[] => {
  const raw = localStorage.getItem(RUNS_KEY);
  if (!raw) return [];

  try {
    return recentRunsResponseSchema.parse({ runs: JSON.parse(raw) }).runs;
  } catch {
    return [];
  }
};

const writeRuns = (runs: RunRecord[]): void => {
  localStorage.setItem(RUNS_KEY, JSON.stringify(runs));
};

export const localGameService: GameService = {
  async getProfile() {
    return ensureProfile();
  },

  async getHighScore() {
    const highScore = readRuns().reduce((best, run) => Math.max(best, run.score), 0);
    return highScoreResponseSchema.parse({ highScore }) satisfies HighScoreResponse;
  },

  async getLeaderboard(limit: number) {
    const profile = ensureProfile();
    const entries = readRuns()
      .sort((a, b) => b.score - a.score || Date.parse(b.endedAt) - Date.parse(a.endedAt))
      .slice(0, Math.max(1, limit))
      .map((run, index) => ({
        rank: index + 1,
        userId: run.userId,
        profileName: profile.name,
        score: run.score,
        endedAt: run.endedAt
      }));

    return leaderboardResponseSchema.parse({ entries }) satisfies LeaderboardResponse;
  },

  async saveRun(run: RunRecordInput) {
    const input = runRecordInputSchema.parse(run);
    const profile = ensureProfile();
    const nextRun = runRecordSchema.parse({
      id: crypto.randomUUID(),
      userId: profile.id,
      ...input
    });

    const runs = [nextRun, ...readRuns()].slice(0, 100);
    writeRuns(runs);
    return nextRun;
  },

  async listRecentRuns(limit: number) {
    return recentRunsResponseSchema.parse({
      runs: readRuns().slice(0, Math.max(1, limit))
    }) satisfies RecentRunsResponse;
  },

  async getSettings() {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;

    try {
      const parsed = JSON.parse(raw) as Partial<GameSettings>;
      return gameSettingsSchema.parse({
        speed: parsed.speed ?? DEFAULT_SETTINGS.speed,
        gridSize: parsed.gridSize ?? DEFAULT_SETTINGS.gridSize
      });
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: GameSettings) {
    const payload = gameSettingsSchema.parse(settings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload));
    return payload;
  }
};
