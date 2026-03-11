import {
  hubSearchParamsSchema,
  hubThemesResponseSchema,
  hubVariationsResponseSchema,
  hubThemeResponseSchema,
  hubVariationResponseSchema,
  shareThemeInputSchema,
  shareVariationInputSchema,
  shareResponseSchema,
  userFavoritesResponseSchema,
  copyToLocalResponseSchema,
  customThemeSchema,
  gameVariationSchema,
  type HubSearchParams,
  type HubThemesResponse,
  type HubVariationsResponse,
  type HubThemeResponse,
  type HubVariationResponse,
  type ShareThemeInput,
  type ShareVariationInput,
  type ShareResponse,
  type UserFavoritesResponse,
  type CopyToLocalResponse,
  type CustomTheme,
  type GameVariation
} from "@snake/contracts";
import type { ZodType } from "zod";
import type { HubService } from "../hubService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const request = async <T>(path: string, schema: ZodType<T>, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return schema.parse(json);
};

export const apiHubService: HubService = {
  // ==================== BROWSE OPERATIONS (PUBLIC) ====================

  browseThemes(params: HubSearchParams) {
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.set("query", params.query);
    if (params.difficulty) queryParams.set("difficulty", params.difficulty);
    if (params.sortBy) queryParams.set("sortBy", params.sortBy);
    queryParams.set("page", params.page.toString());
    queryParams.set("limit", params.limit.toString());

    return request<HubThemesResponse>(
      `/v1/hub/themes?${queryParams.toString()}`,
      hubThemesResponseSchema
    );
  },

  browseVariations(params: HubSearchParams) {
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.set("query", params.query);
    if (params.difficulty) queryParams.set("difficulty", params.difficulty);
    if (params.sortBy) queryParams.set("sortBy", params.sortBy);
    queryParams.set("page", params.page.toString());
    queryParams.set("limit", params.limit.toString());

    return request<HubVariationsResponse>(
      `/v1/hub/variations?${queryParams.toString()}`,
      hubVariationsResponseSchema
    );
  },

  async getSharedTheme(id: string) {
    try {
      return await request<HubThemeResponse>(`/v1/hub/themes/${id}`, hubThemeResponseSchema);
    } catch (error) {
      return null;
    }
  },

  async getSharedVariation(id: string) {
    try {
      return await request<HubVariationResponse>(
        `/v1/hub/variations/${id}`,
        hubVariationResponseSchema
      );
    } catch (error) {
      return null;
    }
  },

  // ==================== SHARE OPERATIONS (AUTH REQUIRED) ====================

  shareTheme(input: ShareThemeInput) {
    const payload = shareThemeInputSchema.parse(input);
    return request<ShareResponse>("/v1/hub/themes", shareResponseSchema, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  shareVariation(input: ShareVariationInput) {
    const payload = shareVariationInputSchema.parse(input);
    return request<ShareResponse>("/v1/hub/variations", shareResponseSchema, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  async updateSharedTheme(id: string, description?: string) {
    await fetch(`${API_BASE_URL}/v1/hub/themes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description })
    });
  },

  async updateSharedVariation(id: string, description?: string) {
    await fetch(`${API_BASE_URL}/v1/hub/variations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description })
    });
  },

  async unshareTheme(id: string) {
    await fetch(`${API_BASE_URL}/v1/hub/themes/${id}`, {
      method: "DELETE"
    });
  },

  async unshareVariation(id: string) {
    await fetch(`${API_BASE_URL}/v1/hub/variations/${id}`, {
      method: "DELETE"
    });
  },

  // ==================== FAVORITE OPERATIONS (AUTH REQUIRED) ====================

  favoriteTheme(sharedThemeId: string) {
    return request<CopyToLocalResponse>(
      `/v1/hub/themes/${sharedThemeId}/favorite`,
      copyToLocalResponseSchema,
      { method: "POST" }
    );
  },

  async unfavoriteTheme(sharedThemeId: string) {
    await fetch(`${API_BASE_URL}/v1/hub/themes/${sharedThemeId}/favorite`, {
      method: "DELETE"
    });
  },

  favoriteVariation(sharedVariationId: string) {
    return request<CopyToLocalResponse>(
      `/v1/hub/variations/${sharedVariationId}/favorite`,
      copyToLocalResponseSchema,
      { method: "POST" }
    );
  },

  async unfavoriteVariation(sharedVariationId: string) {
    await fetch(`${API_BASE_URL}/v1/hub/variations/${sharedVariationId}/favorite`, {
      method: "DELETE"
    });
  },

  getUserFavorites() {
    return request<UserFavoritesResponse>("/v1/hub/favorites", userFavoritesResponseSchema);
  },

  // ==================== COPY OPERATIONS (AUTH REQUIRED) ====================

  async copyThemeToLocal(sharedThemeId: string, customName?: string) {
    const response = await request<CopyToLocalResponse>(
      `/v1/hub/themes/${sharedThemeId}/copy`,
      copyToLocalResponseSchema,
      {
        method: "POST",
        body: JSON.stringify({ customName })
      }
    );

    // Fetch the created theme to return the full object
    const themeResponse = await fetch(`${API_BASE_URL}/v1/themes/${response.localId}`);
    const themeJson = await themeResponse.json();
    return customThemeSchema.parse(themeJson.theme);
  },

  async copyVariationToLocal(sharedVariationId: string, customName?: string) {
    const response = await request<CopyToLocalResponse>(
      `/v1/hub/variations/${sharedVariationId}/copy`,
      copyToLocalResponseSchema,
      {
        method: "POST",
        body: JSON.stringify({ customName })
      }
    );

    // Fetch the created variation to return the full object
    const variationResponse = await fetch(
      `${API_BASE_URL}/v1/variations/${response.localId}`
    );
    const variationJson = await variationResponse.json();
    return gameVariationSchema.parse(variationJson.variation);
  }
};