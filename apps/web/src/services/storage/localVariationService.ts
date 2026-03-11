import type {
  GameVariation,
  GameVariationInput,
  GameVariationListResponse,
  GameVariationResponse,
  Profile
} from "@snake/contracts";
import { profileSchema } from "@snake/contracts";
import type { VariationService } from "../variationService";

const VARIATIONS_KEY = "snake_game_variations";
const PROFILES_KEY = "snake.profiles";

const readProfiles = (): Profile[] => {
  const raw = localStorage.getItem(PROFILES_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((value) => profileSchema.safeParse(value))
      .filter((result): result is { success: true; data: Profile } => result.success)
      .map((result) => result.data);
  } catch {
    return [];
  }
};

const getActiveProfileId = (): string | null => {
  const activeProfile = readProfiles().find((profile) => profile.isActive);
  return activeProfile?.id ?? null;
};

const loadVariations = (): GameVariation[] => {
  const raw = localStorage.getItem(VARIATIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as GameVariation[];
  } catch {
    return [];
  }
};

const saveVariations = (variations: GameVariation[]): void => {
  localStorage.setItem(VARIATIONS_KEY, JSON.stringify(variations));
};

export const localVariationService: VariationService = {
  async getVariations(): Promise<GameVariationListResponse> {
    const profileId = getActiveProfileId();
    if (!profileId) {
      throw new Error("NO_ACTIVE_PROFILE");
    }
    
    const all = loadVariations();
    const variations = all.filter(v => v.profileId === profileId);
    return { variations };
  },

  async getVariation(id: string): Promise<GameVariationResponse> {
    const all = loadVariations();
    const variation = all.find(v => v.id === id);
    if (!variation) {
      throw new Error("VARIATION_NOT_FOUND");
    }
    return { variation };
  },

  async createVariation(input: GameVariationInput): Promise<GameVariationResponse> {
    const profileId = getActiveProfileId();
    if (!profileId) {
      throw new Error("NO_ACTIVE_PROFILE");
    }

    const now = new Date().toISOString();
    const variation: GameVariation = {
      id: crypto.randomUUID(),
      profileId,
      ...input,
      usageCount: 0,
      createdAt: now,
      updatedAt: now
    };

    const all = loadVariations();
    all.push(variation);
    saveVariations(all);

    return { variation };
  },

  async updateVariation(id: string, input: GameVariationInput): Promise<GameVariationResponse> {
    const all = loadVariations();
    const index = all.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error("VARIATION_NOT_FOUND");
    }

    const updated: GameVariation = {
      ...all[index]!,
      ...input,
      updatedAt: new Date().toISOString()
    };

    all[index] = updated;
    saveVariations(all);

    return { variation: updated };
  },

  async deleteVariation(id: string): Promise<void> {
    const all = loadVariations();
    const filtered = all.filter(v => v.id !== id);
    saveVariations(filtered);
  },

  async incrementUsageCount(id: string): Promise<void> {
    const all = loadVariations();
    const index = all.findIndex(v => v.id === id);
    if (index !== -1 && all[index]) {
      all[index].usageCount += 1;
      all[index].updatedAt = new Date().toISOString();
      saveVariations(all);
    }
  }
};
