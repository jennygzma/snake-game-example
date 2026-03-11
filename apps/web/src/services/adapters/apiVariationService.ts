import type { GameVariationInput, VariationResponse, VariationsListResponse } from "@snake/contracts";
import type { VariationService } from "../variationService";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const getHeaders = () => {
  const profileId = localStorage.getItem("activeProfileId");
  return {
    "Content-Type": "application/json",
    ...(profileId && { "x-profile-id": profileId })
  };
};

export const apiVariationService: VariationService = {
  async getVariations(): Promise<VariationsListResponse> {
    const response = await fetch(`${API_BASE}/api/variations`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error("Failed to fetch variations");
    }
    return response.json();
  },

  async getVariation(id: string): Promise<VariationResponse> {
    const response = await fetch(`${API_BASE}/api/variations/${id}`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error("Failed to fetch variation");
    }
    return response.json();
  },

  async createVariation(input: GameVariationInput): Promise<VariationResponse> {
    const response = await fetch(`${API_BASE}/api/variations`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(input)
    });
    if (!response.ok) {
      throw new Error("Failed to create variation");
    }
    return response.json();
  },

  async updateVariation(id: string, input: GameVariationInput): Promise<VariationResponse> {
    const response = await fetch(`${API_BASE}/api/variations/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(input)
    });
    if (!response.ok) {
      throw new Error("Failed to update variation");
    }
    return response.json();
  },

  async deleteVariation(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/api/variations/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error("Failed to delete variation");
    }
  },

  async incrementUsageCount(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/api/variations/${id}/use`, {
      method: "POST",
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error("Failed to increment usage count");
    }
  }
};