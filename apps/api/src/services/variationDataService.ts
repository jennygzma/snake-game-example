import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import type { GameVariation, GameVariationInput } from "@snake/contracts";
import { createVariationQueries } from "../db/variationQueries";

export const createVariationDataService = (db: Database.Database) => {
  const queries = createVariationQueries(db);

  return {
    createVariation: (profileId: string, input: GameVariationInput): GameVariation => {
      const id = randomUUID();
      return queries.createVariation(id, profileId, input);
    },

    updateVariation: (id: string, profileId: string, input: GameVariationInput): GameVariation => {
      return queries.updateVariation(id, profileId, input);
    },

    deleteVariation: (id: string, profileId: string): void => {
      queries.deleteVariation(id, profileId);
    },

    getVariation: (id: string): GameVariation | null => {
      return queries.getVariation(id);
    },

    getVariationsByProfile: (profileId: string): GameVariation[] => {
      return queries.getVariationsByProfile(profileId);
    },

    incrementUsageCount: (id: string): void => {
      queries.incrementUsageCount(id);
    }
  };
};