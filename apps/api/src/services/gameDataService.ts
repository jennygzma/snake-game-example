import {
  DEFAULT_SETTINGS,
  type GameSettings,
  type HighScoreResponse,
  type LeaderboardResponse,
  type Profile,
  type RecentRunsResponse,
  type RunRecord,
  type RunRecordInput
} from "@snake/contracts";

type Store = {
  profile: Profile;
  settings: GameSettings;
  runs: RunRecord[];
};

const store: Store = {
  profile: {
    id: "dev-user-1",
    name: "Player",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    avatarBase64: null
  },
  settings: DEFAULT_SETTINGS,
  runs: [
    {
      id: "seed-run-1",
      userId: "dev-user-1",
      score: 14,
      durationMs: 42000,
      endedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "seed-run-2",
      userId: "dev-user-1",
      score: 9,
      durationMs: 32000,
      endedAt: new Date(Date.now() - 172800000).toISOString()
    }
  ]
};

export const gameDataService = {
  getProfile(): Profile {
    return store.profile;
  },

  getHighScore(): HighScoreResponse {
    const highScore = store.runs.reduce((best, run) => Math.max(best, run.score), 0);
    return { highScore };
  },

  getLeaderboard(limit: number): LeaderboardResponse {
    const entries = [...store.runs]
      .sort((a, b) => b.score - a.score || Date.parse(b.endedAt) - Date.parse(a.endedAt))
      .slice(0, Math.max(1, limit))
      .map((run, index) => ({
        rank: index + 1,
        userId: run.userId,
        profileName: store.profile.name, // In-memory: all runs belong to single profile
        score: run.score,
        endedAt: run.endedAt
      }));

    return { entries };
  },

  getLeaderboardForProfile(profileId: string, limit: number): LeaderboardResponse {
    // In-memory implementation: filter runs by profileId
    const profileRuns = store.runs.filter(run => run.userId === profileId);
    const entries = profileRuns
      .sort((a, b) => b.score - a.score || Date.parse(b.endedAt) - Date.parse(a.endedAt))
      .slice(0, Math.max(1, limit))
      .map((run, index) => ({
        rank: index + 1,
        userId: run.userId,
        profileName: store.profile.name,
        score: run.score,
        endedAt: run.endedAt
      }));

    return { entries };
  },

  getLeaderboardGlobal(limit: number): LeaderboardResponse {
    // In-memory implementation: same as regular leaderboard
    // In real implementation, this would join with profiles table
    return this.getLeaderboard(limit);
  },

  saveRun(input: RunRecordInput): RunRecord {
    const run: RunRecord = {
      id: crypto.randomUUID(),
      userId: store.profile.id,
      ...input
    };

    store.runs = [run, ...store.runs].slice(0, 1000);
    return run;
  },

  listRecentRuns(limit: number): RecentRunsResponse {
    return { runs: store.runs.slice(0, Math.max(1, limit)) };
  },

  getSettings(): GameSettings {
    return store.settings;
  },

  saveSettings(settings: GameSettings): GameSettings {
    store.settings = settings;
    return store.settings;
  }
};
