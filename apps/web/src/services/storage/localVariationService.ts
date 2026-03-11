import type { GameVariation, GameVariationInput, VariationResponse, VariationsListResponse } from "@snake/contracts";
import type { VariationService } from "../variationService";

const generateUUID = (): string => {
  return crypto.randomUUID();
};

const STORAGE_KEY = "game-variations";

const getVariationsFromStorage = (): GameVariation[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveVariationsToStorage = (variations: GameVariation[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(variations));
};

const getCurrentProfileId = (): string | null => {
  return localStorage.getItem("activeProfileId");
};

export const localVariationService: VariationService = {
  async getVariations(): Promise<VariationsListResponse> {
    const profileId = getCurrentProfileId();
    if (!profileId) {
      // No active profile - return empty list
      return { variations: [] };
    }

    const allVariations = getVariationsFromStorage();
    const variations = allVariations.filter((v) => v.profileId === profileId);
    return { variations };
  },

  async getVariation(id: string): Promise<VariationResponse> {
    const variations = getVariationsFromStorage();
    const variation = variations.find((v) => v.id === id);
    if (!variation) {
      throw new Error("Variation not found");
    }
    return { variation };
  },

  async createVariation(input: GameVariationInput): Promise<VariationResponse> {
    const profileId = getCurrentProfileId();
    if (!profileId) {
      throw new Error("No active profile");
    }

    const now = new Date().toISOString();
    const variation: GameVariation = {
      id: generateUUID(),
      profileId,
      ...input,
      usageCount: 0,
      createdAt: now,
      updatedAt: now
    };

    const variations = getVariationsFromStorage();
    variations.push(variation);
    saveVariationsToStorage(variations);

    return { variation };
  },

  async updateVariation(id: string, input: GameVariationInput): Promise<VariationResponse> {
    const profileId = getCurrentProfileId();
    if (!profileId) {
      throw new Error("No active profile");
    }

    const variations = getVariationsFromStorage();
    const index = variations.findIndex((v) => v.id === id && v.profileId === profileId);
    
    if (index === -1) {
      throw new Error("Variation not found or unauthorized");
    }

    const now = new Date().toISOString();
    const existing = variations[index];
    if (!existing) {
      throw new Error("Variation not found");
    }
    
    const updated: GameVariation = {
      id: existing.id,
      profileId: existing.profileId,
      createdAt: existing.createdAt,
      usageCount: existing.usageCount,
      ...input,
      updatedAt: now
    };
    variations[index] = updated;

    saveVariationsToStorage(variations);
    return { variation: updated };
  },

  async deleteVariation(id: string): Promise<void> {
    const profileId = getCurrentProfileId();
    if (!profileId) {
      throw new Error("No active profile");
    }

    const variations = getVariationsFromStorage();
    const filtered = variations.filter((v) => !(v.id === id && v.profileId === profileId));
    
    if (filtered.length === variations.length) {
      throw new Error("Variation not found or unauthorized");
    }

    saveVariationsToStorage(filtered);
  },

  async incrementUsageCount(id: string): Promise<void> {
    const variations = getVariationsFromStorage();
    const variation = variations.find((v) => v.id === id);
    
    if (variation) {
      variation.usageCount += 1;
      saveVariationsToStorage(variations);
    }
  }
};