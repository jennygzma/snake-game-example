import type { Database } from "better-sqlite3";
import { DEFAULT_SETTINGS, type GameSettings, type RunRecordInput, type RunRecord } from "@snake/contracts";

type RunRow = {
  id: string;
  profile_id: string;
  score: number;
  duration_ms: number;
  ended_at: string;
};

export const gameQueries = (db: Database) => ({
  getHighScoreByProfileId(profileId: string): number {
    const row = db
      .prepare(
        `SELECT MAX(score) as high_score
         FROM game_runs
         WHERE profile_id = ?`
      )
      .get(profileId) as { high_score: number | null } | undefined;

    return row?.high_score ?? 0;
  },

  listLeaderboard(limit: number, scope: "active" | "global", profileId: string, variationId?: string): Array<{
    rank: number;
    userId: string;
    profileName: string;
    score: number;
    endedAt: string;
    variationName?: string;
  }> {
    const safeLimit = Math.max(1, limit);
    
    let query = `
      SELECT r.profile_id, p.name AS profile_name, r.score, r.ended_at, v.name AS variation_name
      FROM game_runs r
      JOIN profiles p ON p.id = r.profile_id
      LEFT JOIN game_variations v ON v.id = r.variation_id
    `;
    
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (scope === "active") {
      conditions.push("r.profile_id = ?");
      params.push(profileId);
    }
    
    if (variationId) {
      conditions.push("r.variation_id = ?");
      params.push(variationId);
    }
    
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    
    query += " ORDER BY r.score DESC, datetime(r.ended_at) DESC LIMIT ?";
    params.push(safeLimit);
    
    const rows = db.prepare(query).all(...params) as Array<{
      profile_id: string;
      profile_name: string;
      score: number;
      ended_at: string;
      variation_name: string | null;
    }>;

    return rows.map((row, index) => ({
      rank: index + 1,
      userId: row.profile_id,
      profileName: row.profile_name,
      score: row.score,
      endedAt: row.ended_at,
      variationName: row.variation_name || undefined
    }));
  },

  saveRun(profileId: string, input: RunRecordInput): RunRecord {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    db.prepare(
      `INSERT INTO game_runs (id, profile_id, variation_id, score, duration_ms, ended_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(id, profileId, input.variationId || null, input.score, input.durationMs, input.endedAt, createdAt);

    return {
      id,
      userId: profileId,
      score: input.score,
      durationMs: input.durationMs,
      endedAt: input.endedAt,
      variationId: input.variationId
    };
  },

  listRecentRunsByProfileId(profileId: string, limit: number): RunRecord[] {
    const safeLimit = Math.max(1, limit);
    const rows = db
      .prepare(
        `SELECT id, profile_id, score, duration_ms, ended_at
         FROM game_runs
         WHERE profile_id = ?
         ORDER BY datetime(ended_at) DESC
         LIMIT ?`
      )
      .all(profileId, safeLimit) as RunRow[];

    return rows.map((row) => ({
      id: row.id,
      userId: row.profile_id,
      score: row.score,
      durationMs: row.duration_ms,
      endedAt: row.ended_at
    }));
  },

  getSettingsByProfileId(profileId: string): GameSettings {
    const row = db
      .prepare(
        `SELECT speed, grid_size
         FROM game_settings
         WHERE profile_id = ?`
      )
      .get(profileId) as { speed: number; grid_size: number } | undefined;

    if (!row) return DEFAULT_SETTINGS;

    return {
      speed: row.speed,
      gridSize: row.grid_size
    };
  },

  saveSettingsByProfileId(profileId: string, settings: GameSettings): GameSettings {
    db.prepare(
      `INSERT INTO game_settings (profile_id, speed, grid_size, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(profile_id) DO UPDATE SET
         speed = excluded.speed,
         grid_size = excluded.grid_size,
         updated_at = excluded.updated_at`
    ).run(profileId, settings.speed, settings.gridSize, new Date().toISOString());

    return settings;
  }
});
