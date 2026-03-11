import Database from "better-sqlite3";
import type { GameVariation, GameVariationInput } from "@snake/contracts";

export interface VariationRow {
  id: string;
  profile_id: string;
  name: string;
  description: string | null;
  difficulty: string | null;
  base_speed: number;
  grid_size: number;
  max_concurrent_foods: number;
  snake_head_image: string | null;
  powerup_types: string;
  custom_colors: string | null;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

const rowToVariation = (row: VariationRow): GameVariation => ({
  id: row.id,
  profileId: row.profile_id,
  name: row.name,
  description: row.description || undefined,
  difficulty: row.difficulty as "easy" | "medium" | "hard" | undefined,
  baseSpeed: row.base_speed,
  gridSize: row.grid_size,
  maxConcurrentFoods: row.max_concurrent_foods,
  snakeHeadImage: row.snake_head_image || undefined,
  powerupTypes: JSON.parse(row.powerup_types),
  customColors: row.custom_colors ? JSON.parse(row.custom_colors) : undefined,
  usageCount: row.usage_count,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const getVariationById = (
  db: Database.Database,
  id: string
): GameVariation | null => {
  const row = db
    .prepare(
      `SELECT * FROM game_variations WHERE id = ?`
    )
    .get(id) as VariationRow | undefined;

  return row ? rowToVariation(row) : null;
};

export const getVariationsByProfile = (
  db: Database.Database,
  profileId: string
): GameVariation[] => {
  const rows = db
    .prepare(
      `SELECT * FROM game_variations 
       WHERE profile_id = ? 
       ORDER BY usage_count DESC, name ASC`
    )
    .all(profileId) as VariationRow[];

  return rows.map(rowToVariation);
};

export const createVariation = (
  db: Database.Database,
  id: string,
  profileId: string,
  input: GameVariationInput
): GameVariation => {
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO game_variations (
      id, profile_id, name, description, difficulty,
      base_speed, grid_size, max_concurrent_foods,
      snake_head_image, powerup_types, custom_colors,
      usage_count, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
  ).run(
    id,
    profileId,
    input.name,
    input.description || null,
    input.difficulty || null,
    input.baseSpeed,
    input.gridSize,
    input.maxConcurrentFoods,
    input.snakeHeadImage || null,
    JSON.stringify(input.powerupTypes),
    input.customColors ? JSON.stringify(input.customColors) : null,
    now,
    now
  );

  const variation = getVariationById(db, id);
  if (!variation) {
    throw new Error("Failed to create variation");
  }

  return variation;
};

export const updateVariation = (
  db: Database.Database,
  id: string,
  input: GameVariationInput
): GameVariation => {
  const now = new Date().toISOString();

  const result = db.prepare(
    `UPDATE game_variations SET
      name = ?,
      description = ?,
      difficulty = ?,
      base_speed = ?,
      grid_size = ?,
      max_concurrent_foods = ?,
      snake_head_image = ?,
      powerup_types = ?,
      custom_colors = ?,
      updated_at = ?
    WHERE id = ?`
  ).run(
    input.name,
    input.description || null,
    input.difficulty || null,
    input.baseSpeed,
    input.gridSize,
    input.maxConcurrentFoods,
    input.snakeHeadImage || null,
    JSON.stringify(input.powerupTypes),
    input.customColors ? JSON.stringify(input.customColors) : null,
    now,
    id
  );

  if (result.changes === 0) {
    throw new Error("Variation not found");
  }

  const variation = getVariationById(db, id);
  if (!variation) {
    throw new Error("Failed to update variation");
  }

  return variation;
};

export const deleteVariation = (
  db: Database.Database,
  id: string
): void => {
  const result = db
    .prepare(`DELETE FROM game_variations WHERE id = ?`)
    .run(id);

  if (result.changes === 0) {
    throw new Error("Variation not found");
  }
};

export const incrementUsageCount = (
  db: Database.Database,
  id: string
): void => {
  db.prepare(
    `UPDATE game_variations 
     SET usage_count = usage_count + 1,
         updated_at = ?
     WHERE id = ?`
  ).run(new Date().toISOString(), id);
};