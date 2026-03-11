import {
  gameVariationInputSchema,
  gameVariationListResponseSchema,
  gameVariationResponseSchema,
  type GameVariationInput,
  type GameVariationListResponse,
  type GameVariationResponse
} from "@snake/contracts";
import type { VariationService } from "../variationService";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const getActiveProfileId = (): string => {
  const stored = localStorage.getItem("activeProfileId");
  if (!stored) {
    throw new Error("No active profile");
  }
  return stored;
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