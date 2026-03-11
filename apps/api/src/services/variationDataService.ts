import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import type { GameVariation, GameVariationInput } from "@snake/contracts";
import * as variationQueries from "../db/variationQueries";

export class VariationDataService {
  constructor(private db: Database.Database) {}

  getVariation(id: string): GameVariation | null {
    return variationQueries.getVariationById(this.db, id);
  }

  getVariationsByProfile(profileId: string): GameVariation[] {
    return variationQueries.getVariationsByProfile(this.db, profileId);
  }

  createVariation(profileId: string, input: GameVariationInput): GameVariation {
    const id = randomUUID();
    return variationQueries.createVariation(this.db, id, profileId, input);
  }

  updateVariation(id: string, input: GameVariationInput): GameVariation {
    return variationQueries.updateVariation(this.db, id, input);
  }

  deleteVariation(id: string): void {
    variationQueries.deleteVariation(this.db, id);
  }

  incrementUsageCount(id: string): void {
    variationQueries.incrementUsageCount(this.db, id);
  }
}