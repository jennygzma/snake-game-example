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

const PROFILES_KEY = "snake.profiles";
const RUNS_KEY = "snake.runs";
const SETTINGS_BY_PROFILE_KEY = "snake.settings.by_profile";
const VARIATIONS_KEY = "snake_game_variations";

const readProfiles = (): Profile[] => {
  const raw = localStorage.getItem(PROFILES_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((value) => profileSchema.safeParse(value))
      .filter((result): result is { success: true; data: Profile } => result.success)
      .map((result) => result.data);
  } catch {
    return [];
  }
};

const getActiveProfile = (): Profile => {
  const active = readProfiles().find((profile) => profile.isActive);
  if (!active) {
    throw new Error("No active profile found");
  }
  return active;
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

const readVariationNamesById = (): Map<string, string> => {
  const raw = localStorage.getItem(VARIATIONS_KEY);
  if (!raw) return new Map();

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Map();
    const names = new Map<string, string>();
    for (const variation of parsed) {
      if (
        variation &&
        typeof variation === "object" &&
        typeof variation.id === "string" &&
        typeof variation.name === "string"
      ) {
        names.set(variation.id, variation.name);
      }
    }
    return names;
  } catch {
    return new Map();
  }
};

const writeRuns = (runs: RunRecord[]): void => {
  localStorage.setItem(RUNS_KEY, JSON.stringify(runs));
};

const readSettingsByProfile = (): Record<string, GameSettings> => {
  const raw = localStorage.getItem(SETTINGS_BY_PROFILE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.entries(parsed).reduce<Record<string, GameSettings>>((acc, [profileId, value]) => {
      const result = gameSettingsSchema.safeParse(value);
      if (result.success) {
        acc[profileId] = result.data;
      }
      return acc;
    }, {});
  } catch {
    return {};
  }
};

const writeSettingsByProfile = (settingsByProfile: Record<string, GameSettings>): void => {
  localStorage.setItem(SETTINGS_BY_PROFILE_KEY, JSON.stringify(settingsByProfile));
};

export const localGameService: GameService = {
  async getProfile() {
    return getActiveProfile();
  },

  async getHighScore() {
    const activeProfile = getActiveProfile();
    const highScore = readRuns()
      .filter((run) => run.userId === activeProfile.id)
      .reduce((best, run) => Math.max(best, run.score), 0);
    return highScoreResponseSchema.parse({ highScore }) satisfies HighScoreResponse;
  },

  async getLeaderboard(limit: number, scope: "active" | "global" = "active", variationId?: string) {
    const activeProfile = getActiveProfile();
    const profileNameById = new Map(readProfiles().map((profile) => [profile.id, profile.name]));
    const variationNameById = readVariationNamesById();
    const entries = readRuns()
      .filter((run) => (scope === "global" ? true : run.userId === activeProfile.id))
      .filter((run) => (variationId ? run.variationId === variationId : true))
      .sort((a, b) => b.score - a.score || Date.parse(b.endedAt) - Date.parse(a.endedAt))
      .slice(0, Math.max(1, limit))
      .map((run, index) => ({
        rank: index + 1,
        userId: run.userId,
        profileName: profileNameById.get(run.userId) ?? "Player",
        score: run.score,
        endedAt: run.endedAt,
        variationName: run.variationId ? variationNameById.get(run.variationId) : undefined
      }));

    return leaderboardResponseSchema.parse({ entries }) satisfies LeaderboardResponse;
  },

  async saveRun(run: RunRecordInput) {
    const input = runRecordInputSchema.parse(run);
    const activeProfile = getActiveProfile();
    const nextRun = runRecordSchema.parse({
      id: crypto.randomUUID(),
      userId: activeProfile.id,
      ...input
    });

    const runs = [nextRun, ...readRuns()].slice(0, 1000);
    writeRuns(runs);
    return nextRun;
  },

  async listRecentRuns(limit: number) {
    const activeProfile = getActiveProfile();
    const runs = readRuns()
      .filter((run) => run.userId === activeProfile.id)
      .slice(0, Math.max(1, limit));
    return recentRunsResponseSchema.parse({ runs }) satisfies RecentRunsResponse;
  },

  async getSettings() {
    const activeProfile = getActiveProfile();
    const settingsByProfile = readSettingsByProfile();
    return settingsByProfile[activeProfile.id] ?? DEFAULT_SETTINGS;
  },

  async saveSettings(settings: GameSettings) {
    const payload = gameSettingsSchema.parse(settings);
    const activeProfile = getActiveProfile();
    const settingsByProfile = readSettingsByProfile();
    settingsByProfile[activeProfile.id] = payload;
    writeSettingsByProfile(settingsByProfile);
    return payload;
  }
};
