import Database from "better-sqlite3";
import type { GameVariation } from "@snake/contracts";

interface VariationRow {
  id: string;
  profile_id: string;
  name: string;
  description: string | null;
  difficulty: string;
  snake_head_image: string | null;
  board_background_color: string | null;
  powerups: string; // JSON string
  max_concurrent_foods: number;
  base_speed: number;
  grid_size: number;
  usage_count: number;
  created_at: string;
  updated_at: string;
  is_active: number;
}

function rowToVariation(row: VariationRow): GameVariation {
  return {
    id: row.id,
    profileId: row.profile_id,
    name: row.name,
    description: row.description || undefined,
    difficulty: row.difficulty as GameVariation["difficulty"],
    snakeHeadImage: row.snake_head_image || undefined,
    boardBackgroundColor: row.board_background_color || undefined,
    powerups: JSON.parse(row.powerups),
    maxConcurrentFoods: row.max_concurrent_foods,
    baseSpeed: row.base_speed,
    gridSize: row.grid_size,
    usageCount: row.usage_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isActive: row.is_active === 1,
  };
}

export function createVariation(
  db: Database.Database,
  variation: Omit<GameVariation, "usageCount" | "isActive">
): GameVariation {
  const stmt = db.prepare(`
    INSERT INTO game_variations (
      id, profile_id, name, description, difficulty,
      snake_head_image, board_background_color,
      powerups, max_concurrent_foods,
      base_speed, grid_size,
      usage_count, created_at, updated_at, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, 0)
  `);

  stmt.run(
    variation.id,
    variation.profileId,
    variation.name,
    variation.description || null,
    variation.difficulty,
    variation.snakeHeadImage || null,
    variation.boardBackgroundColor || null,
    JSON.stringify(variation.powerups),
    variation.maxConcurrentFoods,
    variation.baseSpeed,
    variation.gridSize,
    variation.createdAt,
    variation.updatedAt
  );

  return {
    ...variation,
    usageCount: 0,
    isActive: false,
  };
}

export function updateVariation(
  db: Database.Database,
  id: string,
  profileId: string,
  updates: Partial<Omit<GameVariation, "id" | "profileId" | "usageCount" | "createdAt">>
): GameVariation | null {
  const existing = getVariation(db, id, profileId);
  if (!existing) {
    return null;
  }

  const now = new Date().toISOString();
  const stmt = db.prepare(`
    UPDATE game_variations 
    SET 
      name = ?,
      description = ?,
      difficulty = ?,
      snake_head_image = ?,
      board_background_color = ?,
      powerups = ?,
      max_concurrent_foods = ?,
      base_speed = ?,
      grid_size = ?,
      updated_at = ?
    WHERE id = ? AND profile_id = ?
  `);

  stmt.run(
    updates.name ?? existing.name,
    updates.description ?? existing.description ?? null,
    updates.difficulty ?? existing.difficulty,
    updates.snakeHeadImage ?? existing.snakeHeadImage ?? null,
    updates.boardBackgroundColor ?? existing.boardBackgroundColor ?? null,
    JSON.stringify(updates.powerups ?? existing.powerups),
    updates.maxConcurrentFoods ?? existing.maxConcurrentFoods,
    updates.baseSpeed ?? existing.baseSpeed,
    updates.gridSize ?? existing.gridSize,
    now,
    id,
    profileId
  );

  return getVariation(db, id, profileId);
}

export function deleteVariation(
  db: Database.Database,
  id: string,
  profileId: string
): boolean {
  const stmt = db.prepare(
    "DELETE FROM game_variations WHERE id = ? AND profile_id = ?"
  );
  const result = stmt.run(id, profileId);
  return result.changes > 0;
}

export function getVariation(
  db: Database.Database,
  id: string,
  profileId: string
): GameVariation | null {
  const stmt = db.prepare(
    "SELECT * FROM game_variations WHERE id = ? AND profile_id = ?"
  );
  const row = stmt.get(id, profileId) as VariationRow | undefined;
  return row ? rowToVariation(row) : null;
}

export function getVariationsByProfile(
  db: Database.Database,
  profileId: string
): GameVariation[] {
  const stmt = db.prepare(
    "SELECT * FROM game_variations WHERE profile_id = ? ORDER BY created_at DESC"
  );
  const rows = stmt.all(profileId) as VariationRow[];
  return rows.map(rowToVariation);
}

export function getActiveVariation(
  db: Database.Database,
  profileId: string
): GameVariation | null {
  const stmt = db.prepare(
    "SELECT * FROM game_variations WHERE profile_id = ? AND is_active = 1 LIMIT 1"
  );
  const row = stmt.get(profileId) as VariationRow | undefined;
  return row ? rowToVariation(row) : null;
}

export function setActiveVariation(
  db: Database.Database,
  id: string,
  profileId: string
): boolean {
  return db.transaction(() => {
    // Deactivate all variations for this profile
    db.prepare(
      "UPDATE game_variations SET is_active = 0 WHERE profile_id = ?"
    ).run(profileId);

    // Activate the selected variation
    const result = db
      .prepare(
        "UPDATE game_variations SET is_active = 1 WHERE id = ? AND profile_id = ?"
      )
      .run(id, profileId);

    return result.changes > 0;
  })();
}

export function incrementUsageCount(
  db: Database.Database,
  id: string
): void {
  db.prepare(
    "UPDATE game_variations SET usage_count = usage_count + 1 WHERE id = ?"
  ).run(id);
}