import type { GameVariation, GameVariationInput } from "@snake/contracts";
import type { VariationService } from "../variationService";

const STORAGE_KEY = "snake_game_variations";

function getVariations(): GameVariation[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveVariations(variations: GameVariation[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(variations));
}

export const localVariationService: VariationService = {
  async createVariation(profileId: string, input: GameVariationInput): Promise<GameVariation> {
    const variations = getVariations();
    const now = new Date().toISOString();
    
    const newVariation: GameVariation = {
      id: crypto.randomUUID(),
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
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
      isActive: false
    };

    variations.push(newVariation);
    saveVariations(variations);
    return newVariation;
  },

  async updateVariation(id: string, profileId: string, updates: Partial<GameVariationInput>): Promise<GameVariation> {
    const variations = getVariations();
    const index = variations.findIndex((v) => v.id === id && v.profileId === profileId);
    
    if (index === -1) {
      throw new Error("Variation not found");
    }

    const existing = variations[index];
    if (!existing) {
      throw new Error("Variation not found");
    }

    const now = new Date().toISOString();
    const updated: GameVariation = {
      id: existing.id,
      profileId: existing.profileId,
      name: updates.name ?? existing.name,
      description: updates.description ?? existing.description,
      difficulty: updates.difficulty ?? existing.difficulty,
      snakeHeadImage: updates.snakeHeadImage ?? existing.snakeHeadImage,
      boardBackgroundColor: updates.boardBackgroundColor ?? existing.boardBackgroundColor,
      powerups: updates.powerups ?? existing.powerups,
      maxConcurrentFoods: updates.maxConcurrentFoods ?? existing.maxConcurrentFoods,
      baseSpeed: updates.baseSpeed ?? existing.baseSpeed,
      gridSize: updates.gridSize ?? existing.gridSize,
      usageCount: existing.usageCount,
      createdAt: existing.createdAt,
      updatedAt: now,
      isActive: existing.isActive
    };

    variations[index] = updated;
    saveVariations(variations);
    return updated;
  },

  async deleteVariation(id: string, profileId: string): Promise<void> {
    const variations = getVariations();
    const filtered = variations.filter((v) => !(v.id === id && v.profileId === profileId));
    saveVariations(filtered);
  },

  async getVariation(id: string, profileId: string): Promise<GameVariation | null> {
    const variations = getVariations();
    return variations.find((v) => v.id === id && v.profileId === profileId) || null;
  },

  async getVariationsByProfile(profileId: string): Promise<GameVariation[]> {
    const variations = getVariations();
    return variations.filter((v) => v.profileId === profileId);
  },

  async getActiveVariation(profileId: string): Promise<GameVariation | null> {
    const variations = getVariations();
    return variations.find((v) => v.profileId === profileId && v.isActive) || null;
  },

  async setActiveVariation(id: string, profileId: string): Promise<void> {
    const variations = getVariations();
    
    // Deactivate all variations for this profile
    variations.forEach((v) => {
      if (v.profileId === profileId) {
        v.isActive = false;
      }
    });

    // Activate the selected variation
    const variation = variations.find((v) => v.id === id && v.profileId === profileId);
    if (variation) {
      variation.isActive = true;
      saveVariations(variations);
    } else {
      throw new Error("Variation not found");
    }
  }
};