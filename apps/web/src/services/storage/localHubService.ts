import type {
  HubSearchParams,
  HubThemesResponse,
  HubVariationsResponse,
  HubThemeResponse,
  HubVariationResponse,
  ShareThemeInput,
  ShareVariationInput,
  ShareResponse,
  UserFavoritesResponse,
  CopyToLocalResponse,
  CustomTheme,
  GameVariation
} from "@snake/contracts";
import type { HubService } from "../hubService";

/**
 * Local storage hub service for demo/offline mode
 * Simulates hub functionality using localStorage
 */
export const localHubService: HubService = {
  // ==================== BROWSE OPERATIONS (PUBLIC) ====================

  async browseThemes(params: HubSearchParams): Promise<HubThemesResponse> {
    // In local mode, return empty results
    return {
      themes: [],
      meta: {
        total: 0,
        page: params.page,
        limit: params.limit,
        totalPages: 0
      }
    };
  },

  async browseVariations(params: HubSearchParams): Promise<HubVariationsResponse> {
    // In local mode, return empty results
    return {
      variations: [],
      meta: {
        total: 0,
        page: params.page,
        limit: params.limit,
        totalPages: 0
      }
    };
  },

  async getSharedTheme(_id: string): Promise<HubThemeResponse | null> {
    // Not supported in local mode
    return null;
  },

  async getSharedVariation(_id: string): Promise<HubVariationResponse | null> {
    // Not supported in local mode
    return null;
  },

  // ==================== SHARE OPERATIONS (AUTH REQUIRED) ====================

  async shareTheme(_input: ShareThemeInput): Promise<ShareResponse> {
    throw new Error("Sharing is not available in local mode");
  },

  async shareVariation(_input: ShareVariationInput): Promise<ShareResponse> {
    throw new Error("Sharing is not available in local mode");
  },

  async updateSharedTheme(_id: string, _description?: string): Promise<void> {
    throw new Error("Sharing is not available in local mode");
  },

  async updateSharedVariation(_id: string, _description?: string): Promise<void> {
    throw new Error("Sharing is not available in local mode");
  },

  async unshareTheme(_id: string): Promise<void> {
    throw new Error("Sharing is not available in local mode");
  },

  async unshareVariation(_id: string): Promise<void> {
    throw new Error("Sharing is not available in local mode");
  },

  // ==================== FAVORITE OPERATIONS (AUTH REQUIRED) ====================

  async favoriteTheme(_sharedThemeId: string): Promise<CopyToLocalResponse> {
    throw new Error("Favorites are not available in local mode");
  },

  async unfavoriteTheme(_sharedThemeId: string): Promise<void> {
    throw new Error("Favorites are not available in local mode");
  },

  async favoriteVariation(_sharedVariationId: string): Promise<CopyToLocalResponse> {
    throw new Error("Favorites are not available in local mode");
  },

  async unfavoriteVariation(_sharedVariationId: string): Promise<void> {
    throw new Error("Favorites are not available in local mode");
  },

  async getUserFavorites(): Promise<UserFavoritesResponse> {
    return {
      themeIds: [],
      variationIds: []
    };
  },

  // ==================== COPY OPERATIONS (AUTH REQUIRED) ====================

  async copyThemeToLocal(_sharedThemeId: string, _customName?: string): Promise<CustomTheme> {
    throw new Error("Copy is not available in local mode");
  },

  async copyVariationToLocal(
    _sharedVariationId: string,
    _customName?: string
  ): Promise<GameVariation> {
    throw new Error("Copy is not available in local mode");
  }
};