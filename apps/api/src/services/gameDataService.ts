import {
  DEFAULT_SETTINGS,
  type GameSettings,
  type HighScoreResponse,
  type LeaderboardResponse,
  type RecentRunsResponse,
  type RunRecord,
  type RunRecordInput
} from "@snake/contracts";
import { profileQueries } from "../db/profileQueries";

type Store = {
  settings: GameSettings;
  runs: RunRecord[];
};

const store: Store = {
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
  getHighScore(): HighScoreResponse {
    const highScore = store.runs.reduce((best, run) => Math.max(best, run.score), 0);
    return { highScore };
  },

  getLeaderboard(limit: number): LeaderboardResponse {
    const entries = [...store.runs]
      .sort((a, b) => b.score - a.score || Date.parse(b.endedAt) - Date.parse(a.endedAt))
      .slice(0, Math.max(1, limit))
      .map((run, index) => {
        const profile = profileQueries.getProfile(run.userId);
        return {
          rank: index + 1,
          userId: run.userId,
          profileName: profile?.name || "Unknown",
          score: run.score,
          endedAt: run.endedAt
        };
      });

    return { entries };
  },

  saveRun(input: RunRecordInput): RunRecord {
    const activeProfile = profileQueries.getActiveProfile();
    const userId = activeProfile?.id || "unknown";
    
    const run: RunRecord = {
      id: crypto.randomUUID(),
      userId,
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
