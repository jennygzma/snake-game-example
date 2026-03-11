import {
  hubSearchParamsSchema,
  hubThemesResponseSchema,
  hubVariationsResponseSchema,
  shareThemeInputSchema,
  shareVariationInputSchema,
  shareResponseSchema,
  copyToLocalResponseSchema,
  favoritesResponseSchema,
  themeResponseSchema,
  gameVariationResponseSchema,
  type HubSearchParams,
  type HubThemesResponse,
  type HubVariationsResponse,
  type ShareThemeInput,
  type ShareVariationInput,
  type ShareResponse,
  type CopyToLocalResponse,
  type FavoritesResponse,
  type ThemeResponse,
  type GameVariationResponse
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
  async browseThemes(params: HubSearchParams) {
    const validated = hubSearchParamsSchema.parse(params);
    const queryParams = new URLSearchParams();
    
    if (validated.query) queryParams.append("query", validated.query);
    if (validated.difficulty) queryParams.append("difficulty", validated.difficulty);
    if (validated.sortBy) queryParams.append("sortBy", validated.sortBy);
    queryParams.append("page", validated.page.toString());
    queryParams.append("limit", validated.limit.toString());

    const result = await request(
      `/v1/hub/themes?${queryParams.toString()}`,
      hubThemesResponseSchema as ZodType<HubThemesResponse>
    );
    return result;
  },

  async browseVariations(params: HubSearchParams) {
    const validated = hubSearchParamsSchema.parse(params);
    const queryParams = new URLSearchParams();
    
    if (validated.query) queryParams.append("query", validated.query);
    if (validated.difficulty) queryParams.append("difficulty", validated.difficulty);
    if (validated.sortBy) queryParams.append("sortBy", validated.sortBy);
    queryParams.append("page", validated.page.toString());
    queryParams.append("limit", validated.limit.toString());

    const result = await request(
      `/v1/hub/variations?${queryParams.toString()}`,
      hubVariationsResponseSchema as ZodType<HubVariationsResponse>
    );
    return result;
  },

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

  async unshareTheme(sharedId: string) {
    await fetch(`${API_BASE_URL}/v1/hub/themes/${sharedId}`, {
      method: "DELETE"
    });
  },

  async unshareVariation(sharedId: string) {
    await fetch(`${API_BASE_URL}/v1/hub/variations/${sharedId}`, {
      method: "DELETE"
    });
  },

  async favoriteTheme(sharedId: string) {
    await fetch(`${API_BASE_URL}/v1/hub/themes/${sharedId}/favorite`, {
      method: "POST"
    });
  },

  async unfavoriteTheme(sharedId: string) {
    await fetch(`${API_BASE_URL}/v1/hub/themes/${sharedId}/favorite`, {
      method: "DELETE"
    });
  },

  async favoriteVariation(sharedId: string) {
    await fetch(`${API_BASE_URL}/v1/hub/variations/${sharedId}/favorite`, {
      method: "POST"
    });
  },

  async unfavoriteVariation(sharedId: string) {
    await fetch(`${API_BASE_URL}/v1/hub/variations/${sharedId}/favorite`, {
      method: "DELETE"
    });
  },

  async getUserFavorites() {
    const result = await request(
      "/v1/hub/favorites",
      favoritesResponseSchema as ZodType<FavoritesResponse>
    );
    return result;
  },

  async copyThemeToLocal(sharedId: string, customName?: string) {
    const response = await request<CopyToLocalResponse>(
      `/v1/hub/themes/${sharedId}/copy`,
      copyToLocalResponseSchema,
      {
        method: "POST",
        body: JSON.stringify({ customName })
      }
    );

    // Fetch the newly created local theme
    const themeResponse = await request<ThemeResponse>(
      `/v1/themes/${response.localId}`,
      themeResponseSchema
    );

    return themeResponse.theme;
  },

  async copyVariationToLocal(sharedId: string, customName?: string) {
    const response = await request<CopyToLocalResponse>(
      `/v1/hub/variations/${sharedId}/copy`,
      copyToLocalResponseSchema,
      {
        method: "POST",
        body: JSON.stringify({ customName })
      }
    );

    // Fetch the newly created local variation
    const variationResponse = await request(
      `/v1/variations/${response.localId}`,
      gameVariationResponseSchema as ZodType<GameVariationResponse>
    );

    return variationResponse.variation;
  }
};