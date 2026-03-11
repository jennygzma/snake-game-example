import { gameVariationResponseSchema, gameVariationsResponseSchema } from "@snake/contracts";
import type { GameVariation, GameVariationInput } from "@snake/contracts";
import type { VariationService } from "../variationService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function request<T>(
  endpoint: string,
  options: RequestInit,
  profileId: string,
  parseResponse: (data: unknown) => T
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-profile-id": profileId,
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return parseResponse(data);
}

export const apiVariationService: VariationService = {
  async createVariation(profileId: string, input: GameVariationInput): Promise<GameVariation> {
    const { variation } = await request(
      "/v1/variations",
      {
        method: "POST",
        body: JSON.stringify({ ...input, profileId })
      },
      profileId,
      (data) => gameVariationResponseSchema.parse(data)
    );
    return variation;
  },

  async updateVariation(id: string, profileId: string, updates: Partial<GameVariationInput>): Promise<GameVariation> {
    const { variation } = await request(
      `/v1/variations/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(updates)
      },
      profileId,
      (data) => gameVariationResponseSchema.parse(data)
    );
    return variation;
  },

  async deleteVariation(id: string, profileId: string): Promise<void> {
    await fetch(`${API_BASE_URL}/v1/variations/${id}`, {
      method: "DELETE",
      headers: {
        "x-profile-id": profileId
      }
    });
  },

  async getVariation(id: string, profileId: string): Promise<GameVariation | null> {
    try {
      const { variation } = await request(
        `/v1/variations/${id}`,
        { method: "GET" },
        profileId,
        (data) => gameVariationResponseSchema.parse(data)
      );
      return variation;
    } catch {
      return null;
    }
  },

  async getVariationsByProfile(profileId: string): Promise<GameVariation[]> {
    const { variations } = await request(
      "/v1/variations",
      { method: "GET" },
      profileId,
      (data) => gameVariationsResponseSchema.parse(data)
    );
    return variations;
  },

  async getActiveVariation(profileId: string): Promise<GameVariation | null> {
    try {
      const { variation } = await request(
        "/v1/variations/active",
        { method: "GET" },
        profileId,
        (data) => gameVariationResponseSchema.parse(data)
      );
      return variation;
    } catch {
      return null;
    }
  },

  async setActiveVariation(id: string, profileId: string): Promise<void> {
    await request(
      `/v1/variations/${id}/activate`,
      { method: "POST" },
      profileId,
      (data) => data
    );
  }
};