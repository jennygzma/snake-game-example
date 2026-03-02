import type {
  GameSettings,
  HighScoreResponse,
  LeaderboardResponse,
  Profile,
  RecentRunsResponse,
  RunRecord,
  RunRecordInput
} from "@snake/contracts";

export interface GameService {
  getProfile(): Promise<Profile>;
  getHighScore(): Promise<HighScoreResponse>;
  getLeaderboard(limit: number): Promise<LeaderboardResponse>;
  saveRun(run: RunRecordInput): Promise<RunRecord>;
  listRecentRuns(limit: number): Promise<RecentRunsResponse>;
  getSettings(): Promise<GameSettings>;
  saveSettings(settings: GameSettings): Promise<GameSettings>;
}
