import Database from "better-sqlite3";
import type { GameVariation, GameVariationInput, PowerupType } from "@snake/contracts";

export const createVariationQueries = (db: Database.Database) => {
  const insertVariation = db.prepare(`
    INSERT INTO game_variations (
      id, profile_id, name, description, difficulty,
      snake_head_image, max_concurrent_foods, enabled_powerups,
      base_speed, base_grid_size, is_public, usage_count,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const updateVariation = db.prepare(`
    UPDATE game_variations 
    SET name = ?, description = ?, difficulty = ?,
        snake_head_image = ?, max_concurrent_foods = ?, enabled_powerups = ?,
        base_speed = ?, base_grid_size = ?, is_public = ?, updated_at = ?
    WHERE id = ? AND profile_id = ?
  `);

  const deleteVariation = db.prepare(`
    DELETE FROM game_variations WHERE id = ? AND profile_id = ?
  `);

  const getVariationById = db.prepare(`
    SELECT * FROM game_variations WHERE id = ?
  `);

  const getVariationsByProfile = db.prepare(`
    SELECT * FROM game_variations 
    WHERE profile_id = ? 
    ORDER BY created_at DESC
  `);

  const incrementUsageCount = db.prepare(`
    UPDATE game_variations 
    SET usage_count = usage_count + 1 
    WHERE id = ?
  `);

  const parseVariationRow = (row: any): GameVariation => {
    return {
      id: row.id,
      profileId: row.profile_id,
      name: row.name,
      description: row.description,
      difficulty: row.difficulty,
      snakeHeadImage: row.snake_head_image || undefined,
      maxConcurrentFoods: row.max_concurrent_foods,
      enabledPowerups: JSON.parse(row.enabled_powerups) as PowerupType[],
      baseSpeed: row.base_speed,
      baseGridSize: row.base_grid_size,
      isPublic: row.is_public === 1,
      usageCount: row.usage_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  };

  return {
    createVariation: (id: string, profileId: string, input: GameVariationInput): GameVariation => {
      const now = new Date().toISOString();

      insertVariation.run(
        id,
        profileId,
        input.name,
        input.description,
        input.difficulty,
        input.snakeHeadImage || null,
        input.maxConcurrentFoods,
        JSON.stringify(input.enabledPowerups),
        input.baseSpeed,
        input.baseGridSize,
        input.isPublic ? 1 : 0,
        0, // usageCount
        now,
        now
      );

      const row = getVariationById.get(id);
      if (!row) {
        throw new Error("Failed to create variation");
      }

      return parseVariationRow(row);
    },

    updateVariation: (id: string, profileId: string, input: GameVariationInput): GameVariation => {
      const now = new Date().toISOString();

      const result = updateVariation.run(
        input.name,
        input.description,
        input.difficulty,
        input.snakeHeadImage || null,
        input.maxConcurrentFoods,
        JSON.stringify(input.enabledPowerups),
        input.baseSpeed,
        input.baseGridSize,
        input.isPublic ? 1 : 0,
        now,
        id,
        profileId
      );

      if (result.changes === 0) {
        throw new Error("Variation not found or unauthorized");
      }

      const row = getVariationById.get(id);
      if (!row) {
        throw new Error("Failed to retrieve updated variation");
      }

      return parseVariationRow(row);
    },

    deleteVariation: (id: string, profileId: string): void => {
      const result = deleteVariation.run(id, profileId);
      if (result.changes === 0) {
        throw new Error("Variation not found or unauthorized");
      }
    },

    getVariation: (id: string): GameVariation | null => {
      const row = getVariationById.get(id);
      if (!row) return null;
      return parseVariationRow(row);
    },

    getVariationsByProfile: (profileId: string): GameVariation[] => {
      const rows = getVariationsByProfile.all(profileId);
      return rows.map(parseVariationRow);
    },

    incrementUsageCount: (id: string): void => {
      incrementUsageCount.run(id);
    }
  };
};