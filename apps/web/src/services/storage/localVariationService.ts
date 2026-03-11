import type {
  GameVariation,
  GameVariationInput,
  GameVariationListResponse,
  GameVariationResponse
} from "@snake/contracts";
import type { VariationService } from "../variationService";

const STORAGE_KEY = "snake_variations";

const createId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `variation-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const getActiveProfileId = (): string => {
  const stored = localStorage.getItem("activeProfileId");
  if (!stored) {
    throw new Error("No active profile");
  }
  return stored;
};

const loadVariations = (): GameVariation[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveVariations = (variations: GameVariation[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(variations));
};

export const localVariationService: VariationService = {
  async getVariations(): Promise<GameVariationListResponse> {
    const profileId = getActiveProfileId();
    const all = loadVariations();
    const variations = all.filter((v) => v.profileId === profileId);
    return { variations };
  },

  async getVariation(id: string): Promise<GameVariationResponse> {
    const all = loadVariations();
    const variation = all.find((v) => v.id === id);
    if (!variation) {
      throw new Error("Variation not found");
    }
    return { variation };
  },

  async createVariation(input: GameVariationInput): Promise<GameVariationResponse> {
    const profileId = getActiveProfileId();
    const all = loadVariations();
    const now = new Date().toISOString();
    
    const variation: GameVariation = {
      id: createId(),
      profileId,
      ...input,
      usageCount: 0,
      createdAt: now,
      updatedAt: now
    };

    all.push(variation);
    saveVariations(all);

    return { variation };
  },

  async updateVariation(id: string, input: GameVariationInput): Promise<GameVariationResponse> {
    const all = loadVariations();
    const index = all.findIndex((v) => v.id === id);
    
    if (index === -1) {
      throw new Error("Variation not found");
    }

    const existing = all[index]!;
    const updated: GameVariation = {
      id: existing.id,
      profileId: existing.profileId,
      name: input.name,
      description: input.description,
      difficulty: input.difficulty,
      baseSpeed: input.baseSpeed,
      gridSize: input.gridSize,
      maxConcurrentFoods: input.maxConcurrentFoods,
      snakeHeadImage: input.snakeHeadImage,
      powerupTypes: input.powerupTypes,
      customColors: input.customColors,
      usageCount: existing.usageCount,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString()
    };

    all[index] = updated;
    saveVariations(all);

    return { variation: updated };
  },

  async deleteVariation(id: string): Promise<void> {
    const all = loadVariations();
    const filtered = all.filter((v) => v.id !== id);
    
    if (filtered.length === all.length) {
      throw new Error("Variation not found");
    }

    saveVariations(filtered);
  },

  async incrementUsageCount(id: string): Promise<void> {
    const all = loadVariations();
    const variation = all.find((v) => v.id === id);
    
    if (!variation) {
      throw new Error("Variation not found");
    }

    variation.usageCount += 1;
    variation.updatedAt = new Date().toISOString();
    saveVariations(all);
  }
};
