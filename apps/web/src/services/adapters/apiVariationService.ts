import type {
  GameVariationInput,
  GameVariationListResponse,
  GameVariationResponse
} from "@snake/contracts";
import {
  gameVariationInputSchema,
  gameVariationListResponseSchema,
  gameVariationResponseSchema
} from "@snake/contracts";
import type { VariationService } from "../variationService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const request = async <T>(
  url: string,
  options: RequestInit,
  schema: { parse: (data: unknown) => T }
): Promise<T> => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  const data = await response.json();
  return schema.parse(data);
};

export const apiVariationService: VariationService = {
  async getVariations(): Promise<GameVariationListResponse> {
    return request(
      `${API_BASE_URL}/v1/variations`,
      { method: "GET" },
      gameVariationListResponseSchema
    );
  },

  async getVariation(id: string): Promise<GameVariationResponse> {
    return request(
      `${API_BASE_URL}/v1/variations/${id}`,
      { method: "GET" },
      gameVariationResponseSchema
    );
  },

  async createVariation(input: GameVariationInput): Promise<GameVariationResponse> {
    const validated = gameVariationInputSchema.parse(input);
    return request(
      `${API_BASE_URL}/v1/variations`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated)
      },
      gameVariationResponseSchema
    );
  },

  async updateVariation(id: string, input: GameVariationInput): Promise<GameVariationResponse> {
    const validated = gameVariationInputSchema.parse(input);
    return request(
      `${API_BASE_URL}/v1/variations/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated)
      },
      gameVariationResponseSchema
    );
  },

  async deleteVariation(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/v1/variations/${id}`, {
      method: "DELETE"
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }
  },

  async incrementUsageCount(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/v1/variations/${id}/increment-usage`, {
      method: "POST"
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }
  }
};
