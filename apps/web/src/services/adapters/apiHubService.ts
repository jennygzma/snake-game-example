import type { HubService } from "../hubService";
import type {
  HubSearchParams,
  HubThemesResponse,
  HubVariationsResponse,
  SharedThemeResponse,
  SharedVariationResponse,
  ShareThemeInput,
  ShareVariationInput,
  ShareResponse,
  UnshareResponse,
  FavoriteResponse,
  CopyThemeResponse,
  CopyVariationResponse,
  UserFavorites
} from "@snake/contracts";
import {
  hubThemesResponseSchema,
  hubVariationsResponseSchema,
  sharedThemeResponseSchema,
  sharedVariationResponseSchema,
  shareResponseSchema,
  unshareResponseSchema,
  favoriteResponseSchema,
  copyThemeResponseSchema,
  copyVariationResponseSchema,
  userFavoritesSchema
} from "@snake/contracts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function request<T>(
  url: string,
  options: RequestInit = {},
  schema: { parse: (data: unknown) => T }
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return schema.parse(data);
}

export const apiHubService: HubService = {
  // ============ BROWSE (PUBLIC) ============

  async browseThemes(params: HubSearchParams): Promise<HubThemesResponse> {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.append("query", params.query);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());

    const queryString = searchParams.toString();
    const url = `/v1/hub/themes${queryString ? `?${queryString}` : ""}`;

    return request(url, {}, hubThemesResponseSchema);
  },

  async browseVariations(params: HubSearchParams): Promise<HubVariationsResponse> {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.append("query", params.query);
    if (params.difficulty) searchParams.append("difficulty", params.difficulty);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());

    const queryString = searchParams.toString();
    const url = `/v1/hub/variations${queryString ? `?${queryString}` : ""}`;

    return request(url, {}, hubVariationsResponseSchema);
  },

  async getSharedTheme(id: string): Promise<SharedThemeResponse> {
    return request(`/v1/hub/themes/${id}`, {}, sharedThemeResponseSchema);
  },

  async getSharedVariation(id: string): Promise<SharedVariationResponse> {
    return request(`/v1/hub/variations/${id}`, {}, sharedVariationResponseSchema);
  },

  // ============ SHARE/UNSHARE (AUTH REQUIRED) ============

  async shareTheme(input: ShareThemeInput): Promise<ShareResponse> {
    return request(
      "/v1/hub/themes",
      {
        method: "POST",
        body: JSON.stringify(input)
      },
      shareResponseSchema
    );
  },

  async shareVariation(input: ShareVariationInput): Promise<ShareResponse> {
    return request(
      "/v1/hub/variations",
      {
        method: "POST",
        body: JSON.stringify(input)
      },
      shareResponseSchema
    );
  },

  async unshareTheme(sharedId: string): Promise<UnshareResponse> {
    return request(
      `/v1/hub/themes/${sharedId}`,
      {
        method: "DELETE"
      },
      unshareResponseSchema
    );
  },

  async unshareVariation(sharedId: string): Promise<UnshareResponse> {
    return request(
      `/v1/hub/variations/${sharedId}`,
      {
        method: "DELETE"
      },
      unshareResponseSchema
    );
  },

  // ============ FAVORITES (AUTH REQUIRED) ============

  async favoriteTheme(sharedId: string): Promise<FavoriteResponse> {
    return request(
      `/v1/hub/themes/${sharedId}/favorite`,
      {
        method: "POST"
      },
      favoriteResponseSchema
    );
  },

  async unfavoriteTheme(sharedId: string): Promise<FavoriteResponse> {
    return request(
      `/v1/hub/themes/${sharedId}/favorite`,
      {
        method: "DELETE"
      },
      favoriteResponseSchema
    );
  },

  async favoriteVariation(sharedId: string): Promise<FavoriteResponse> {
    return request(
      `/v1/hub/variations/${sharedId}/favorite`,
      {
        method: "POST"
      },
      favoriteResponseSchema
    );
  },

  async unfavoriteVariation(sharedId: string): Promise<FavoriteResponse> {
    return request(
      `/v1/hub/variations/${sharedId}/favorite`,
      {
        method: "DELETE"
      },
      favoriteResponseSchema
    );
  },

  async getUserFavorites(): Promise<UserFavorites> {
    return request("/v1/hub/favorites", {}, userFavoritesSchema);
  },

  // ============ COPY TO LOCAL (AUTH REQUIRED) ============

  async copyThemeToLocal(sharedId: string, customName?: string): Promise<CopyThemeResponse> {
    return request(
      `/v1/hub/themes/${sharedId}/copy`,
      {
        method: "POST",
        body: JSON.stringify({ customName })
      },
      copyThemeResponseSchema
    );
  },

  async copyVariationToLocal(sharedId: string, customName?: string): Promise<CopyVariationResponse> {
    return request(
      `/v1/hub/variations/${sharedId}/copy`,
      {
        method: "POST",
        body: JSON.stringify({ customName })
      },
      copyVariationResponseSchema
    );
  }
};