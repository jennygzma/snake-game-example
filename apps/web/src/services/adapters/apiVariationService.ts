import {
  gameVariationInputSchema,
  gameVariationListResponseSchema,
  gameVariationResponseSchema,
  profileSchema,
  type GameVariationInput,
  type GameVariationListResponse,
  type GameVariationResponse,
  type Profile
} from "@snake/contracts";
import type { VariationService } from "../variationService";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
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

const getActiveProfileId = (): string => {
  const activeProfile = readProfiles().find((profile) => profile.isActive);
  if (!activeProfile) {
    throw new Error("No active profile");
  }
  return activeProfile.id;
};

const request = async <T>(
  path: string,
  schema: { parse: (data: unknown) => T },
  options?: RequestInit
): Promise<T> => {
  const profileId = getActiveProfileId();
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-profile-id": profileId,
      ...options?.headers
    }
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();
  return schema.parse(data);
};

export const apiVariationService: VariationService = {
  async getVariations(): Promise<GameVariationListResponse> {
    return request("/v1/variations", gameVariationListResponseSchema);
  },

  async getVariation(id: string): Promise<GameVariationResponse> {
    return request(`/v1/variations/${id}`, gameVariationResponseSchema);
  },

  async createVariation(input: GameVariationInput): Promise<GameVariationResponse> {
    return request("/v1/variations", gameVariationResponseSchema, {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  async updateVariation(id: string, input: GameVariationInput): Promise<GameVariationResponse> {
    return request(`/v1/variations/${id}`, gameVariationResponseSchema, {
      method: "PUT",
      body: JSON.stringify(input)
    });
  },

  async deleteVariation(id: string): Promise<void> {
    await fetch(`${API_BASE}/v1/variations/${id}`, {
      method: "DELETE",
      headers: {
        "x-profile-id": getActiveProfileId()
      }
    });
  },

  async incrementUsageCount(id: string): Promise<void> {
    await fetch(`${API_BASE}/v1/variations/${id}/use`, {
      method: "POST",
      headers: {
        "x-profile-id": getActiveProfileId()
      }
    });
  }
};
