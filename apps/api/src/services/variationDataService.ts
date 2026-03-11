import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import type { GameVariation, GameVariationInput } from "@snake/contracts";
import * as variationQueries from "../db/variationQueries.js";

export function createVariation(
  db: Database.Database,
  profileId: string,
  input: GameVariationInput
): GameVariation {
  const now = new Date().toISOString();
  const id = randomUUID();

  const variation: Omit<GameVariation, "usageCount" | "isActive"> = {
    id,
    profileId,
    name: input.name,
    description: input.description,
    difficulty: input.difficulty,
    snakeHeadImage: input.snakeHeadImage,
    boardBackgroundColor: input.boardBackgroundColor,
    powerups: input.powerups,
    maxConcurrentFoods: input.maxConcurrentFoods,
    baseSpeed: input.baseSpeed,
    gridSize: input.gridSize,
    createdAt: now,
    updatedAt: now,
  };

  return variationQueries.createVariation(db, variation);
}

export function updateVariation(
  db: Database.Database,
  id: string,
  profileId: string,
  updates: Partial<GameVariationInput>
): GameVariation | null {
  return variationQueries.updateVariation(db, id, profileId, updates);
}

export function deleteVariation(
  db: Database.Database,
  id: string,
  profileId: string
): boolean {
  return variationQueries.deleteVariation(db, id, profileId);
}

export function getVariation(
  db: Database.Database,
  id: string,
  profileId: string
): GameVariation | null {
  return variationQueries.getVariation(db, id, profileId);
}

export function getVariationsByProfile(
  db: Database.Database,
  profileId: string
): GameVariation[] {
  return variationQueries.getVariationsByProfile(db, profileId);
}

export function getActiveVariation(
  db: Database.Database,
  profileId: string
): GameVariation | null {
  return variationQueries.getActiveVariation(db, profileId);
}

export function setActiveVariation(
  db: Database.Database,
  id: string,
  profileId: string
): boolean {
  return variationQueries.setActiveVariation(db, id, profileId);
}

export function incrementUsageCount(
  db: Database.Database,
  id: string
): void {
  variationQueries.incrementUsageCount(db, id);
}