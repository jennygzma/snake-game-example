import {
  hubSearchParamsSchema,
  shareThemeInputSchema,
  shareVariationInputSchema,
  hubThemesResponseSchema,
  hubVariationsResponseSchema,
  sharedThemeResponseSchema,
  sharedVariationResponseSchema,
  shareResponseSchema,
  unshareResponseSchema,
  favoriteResponseSchema,
  unfavoriteResponseSchema,
  userFavoritesResponseSchema,
  copyThemeToLocalResponseSchema,
  copyVariationToLocalResponseSchema,
  customThemeSchema,
  gameVariationSchema,
  type HubSearchParams,
  type HubThemesResponse,
  type HubVariationsResponse,
  type SharedThemeResponse,
  type SharedVariationResponse,
  type ShareThemeInput,
  type ShareVariationInput,
  type ShareResponse,
  type UnshareResponse,
  type FavoriteResponse,
  type UnfavoriteResponse,
  type UserFavoritesResponse,
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
  // ==================== Public Browse Operations ====================

  browseThemes(params: HubSearchParams) {
    const validatedParams = hubSearchParamsSchema.parse(params);
    const queryParams = new URLSearchParams();
    
    if (validatedParams.query) queryParams.append("query", validatedParams.query);
    if (validatedParams.difficulty) queryParams.append("difficulty", validatedParams.difficulty);
    if (validatedParams.sortBy) queryParams.append("sortBy", validatedParams.sortBy);
    if (validatedParams.page) queryParams.append("page", validatedParams.page.toString());
    if (validatedParams.limit) queryParams.append("limit", validatedParams.limit.toString());

    return request<HubThemesResponse>(
      `/v1/hub/themes?${queryParams.toString()}`,
      hubThemesResponseSchema
    );
  },

  browseVariations(params: HubSearchParams) {
    const validatedParams = hubSearchParamsSchema.parse(params);
    const queryParams = new URLSearchParams();
    
    if (validatedParams.query) queryParams.append("query", validatedParams.query);
    if (validatedParams.difficulty) queryParams.append("difficulty", validatedParams.difficulty);
    if (validatedParams.sortBy) queryParams.append("sortBy", validatedParams.sortBy);
    if (validatedParams.page) queryParams.append("page", validatedParams.page.toString());
    if (validatedParams.limit) queryParams.append("limit", validatedParams.limit.toString());

    return request<HubVariationsResponse>(
      `/v1/hub/variations?${queryParams.toString()}`,
      hubVariationsResponseSchema
    );
  },

  async getSharedTheme(id: string) {
    try {
      return await request<SharedThemeResponse>(
        `/v1/hub/themes/${id}`,
        sharedThemeResponseSchema
      );
    } catch (error) {
      return null;
    }
  },

  async getSharedVariation(id: string) {
    try {
      return await request<SharedVariationResponse>(
        `/v1/hub/variations/${id}`,
        sharedVariationResponseSchema
      );
    } catch (error) {
      return null;
    }
  },

  // ==================== Creator Operations (Auth Required) ====================

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

  updateSharedTheme(id: string, description: string) {
    return request<UnshareResponse>(`/v1/hub/themes/${id}`, unshareResponseSchema, {
      method: "PUT",
      body: JSON.stringify({ description })
    });
  },

  updateSharedVariation(id: string, description: string) {
    return request<UnshareResponse>(`/v1/hub/variations/${id}`, unshareResponseSchema, {
      method: "PUT",
      body: JSON.stringify({ description })
    });
  },

  unshareTheme(id: string) {
    return request<UnshareResponse>(`/v1/hub/themes/${id}`, unshareResponseSchema, {
      method: "DELETE"
    });
  },

  unshareVariation(id: string) {
    return request<UnshareResponse>(`/v1/hub/variations/${id}`, unshareResponseSchema, {
      method: "DELETE"
    });
  },

  // ==================== Favorite Operations (Auth Required) ====================

  favoriteTheme(sharedThemeId: string) {
    return request<FavoriteResponse>(
      `/v1/hub/themes/${sharedThemeId}/favorite`,
      favoriteResponseSchema,
      {
        method: "POST"
      }
    );
  },

  unfavoriteTheme(sharedThemeId: string) {
    return request<UnfavoriteResponse>(
      `/v1/hub/themes/${sharedThemeId}/favorite`,
      unfavoriteResponseSchema,
      {
        method: "DELETE"
      }
    );
  },

  favoriteVariation(sharedVariationId: string) {
    return request<FavoriteResponse>(
      `/v1/hub/variations/${sharedVariationId}/favorite`,
      favoriteResponseSchema,
      {
        method: "POST"
      }
    );
  },

  unfavoriteVariation(sharedVariationId: string) {
    return request<UnfavoriteResponse>(
      `/v1/hub/variations/${sharedVariationId}/favorite`,
      unfavoriteResponseSchema,
      {
        method: "DELETE"
      }
    );
  },

  getUserFavorites() {
    return request<UserFavoritesResponse>("/v1/hub/favorites", userFavoritesResponseSchema);
  },

  // ==================== Copy to Local Operations (Auth Required) ====================

  async copyThemeToLocal(sharedThemeId: string, customName?: string) {
    const response = await request(
      `/v1/hub/themes/${sharedThemeId}/copy`,
      copyThemeToLocalResponseSchema,
      {
        method: "POST",
        body: JSON.stringify({ customName })
      }
    );
    
    // Fetch the newly created local theme
    const themeResponse = await fetch(`${API_BASE_URL}/v1/themes/${response.localThemeId}`);
    if (!themeResponse.ok) {
      throw new Error("Failed to fetch copied theme");
    }
    const themeJson = await themeResponse.json();
    return customThemeSchema.parse(themeJson.theme);
  },

  async copyVariationToLocal(sharedVariationId: string, customName?: string) {
    const response = await request(
      `/v1/hub/variations/${sharedVariationId}/copy`,
      copyVariationToLocalResponseSchema,
      {
        method: "POST",
        body: JSON.stringify({ customName })
      }
    );
    
    // Fetch the newly created local variation
    const variationResponse = await fetch(
      `${API_BASE_URL}/v1/variations/${response.localVariationId}`
    );
    if (!variationResponse.ok) {
      throw new Error("Failed to fetch copied variation");
    }
    const variationJson = await variationResponse.json();
    return gameVariationSchema.parse(variationJson.variation);
  }
};