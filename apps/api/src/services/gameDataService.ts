import type {
  GameSettings,
  HighScoreResponse,
  LeaderboardResponse,
  Profile,
  RecentRunsResponse,
  RunRecord,
  RunRecordInput
} from "@snake/contracts";
import type { Database } from "better-sqlite3";
import { profileQueries } from "../db/profileQueries";
import { gameQueries } from "../db/gameQueries";

export const createGameDataService = (db: Database) => {
  const profiles = profileQueries(db);
  const games = gameQueries(db);

  const getActiveProfile = (): Profile => {
    const profile = profiles.getActive();
    if (!profile) {
      throw new Error("NO_ACTIVE_PROFILE");
    }
    return profile;
  };

  return {
    getProfile(): Profile {
      return getActiveProfile();
    },

    getHighScore(): HighScoreResponse {
      const profile = getActiveProfile();
      return { highScore: games.getHighScoreByProfileId(profile.id) };
    },

    getLeaderboard(limit: number, scope: "active" | "global"): LeaderboardResponse {
      const profile = getActiveProfile();
      return { entries: games.listLeaderboard(limit, scope, profile.id) };
    },

    saveRun(input: RunRecordInput): RunRecord {
      const profile = getActiveProfile();
      return games.saveRun(profile.id, input);
    },

    listRecentRuns(limit: number): RecentRunsResponse {
      const profile = getActiveProfile();
      return { runs: games.listRecentRunsByProfileId(profile.id, limit) };
    },

    getSettings(): GameSettings {
      const profile = getActiveProfile();
      return games.getSettingsByProfileId(profile.id);
    },

    saveSettings(settings: GameSettings): GameSettings {
      const profile = getActiveProfile();
      return games.saveSettingsByProfileId(profile.id, settings);
    }
  };
};
