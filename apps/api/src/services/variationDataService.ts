import type {
  GameVariation,
  GameVariationInput,
  GameVariationListResponse,
  GameVariationResponse,
  Profile
} from "@snake/contracts";
import type { Database } from "better-sqlite3";
import { profileQueries } from "../db/profileQueries";
import { variationQueries } from "../db/variationQueries";

export const createVariationDataService = (db: Database) => {
  const profiles = profileQueries(db);
  const variations = variationQueries(db);

  const getActiveProfile = (): Profile => {
    const profile = profiles.getActive();
    if (!profile) {
      throw new Error("NO_ACTIVE_PROFILE");
    }
    return profile;
  };

  return {
    getVariations(): GameVariationListResponse {
      const profile = getActiveProfile();
      return { variations: variations.getVariationsByProfileId(profile.id) };
    },

    getVariation(id: string): GameVariationResponse {
      const variation = variations.getVariationById(id);
      if (!variation) {
        throw new Error("VARIATION_NOT_FOUND");
      }
      return { variation };
    },

    createVariation(input: GameVariationInput): GameVariationResponse {
      const profile = getActiveProfile();
      const variation = variations.createVariation(profile.id, input);
      return { variation };
    },

    updateVariation(id: string, input: GameVariationInput): GameVariationResponse {
      const variation = variations.updateVariation(id, input);
      return { variation };
    },

    deleteVariation(id: string): void {
      variations.deleteVariation(id);
    },

    incrementUsageCount(id: string): void {
      variations.incrementUsageCount(id);
    }
  };
};