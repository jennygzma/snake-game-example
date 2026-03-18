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

export interface HubService {
  // ==================== BROWSE OPERATIONS (PUBLIC) ====================

  /**
   * Browse shared themes with search, filtering, and pagination
   */
  browseThemes(params: HubSearchParams): Promise<HubThemesResponse>;

  /**
   * Browse shared variations with search, filtering, and pagination
   */
  browseVariations(params: HubSearchParams): Promise<HubVariationsResponse>;

  /**
   * Get a single shared theme by ID
   */
  getSharedTheme(id: string): Promise<HubThemeResponse | null>;

  /**
   * Get a single shared variation by ID
   */
  getSharedVariation(id: string): Promise<HubVariationResponse | null>;

  // ==================== SHARE OPERATIONS (AUTH REQUIRED) ====================

  /**
   * Share a theme to the hub
   */
  shareTheme(input: ShareThemeInput): Promise<ShareResponse>;

  /**
   * Share a variation to the hub
   */
  shareVariation(input: ShareVariationInput): Promise<ShareResponse>;

  /**
   * Update shared theme description (creator only)
   */
  updateSharedTheme(id: string, description?: string): Promise<void>;

  /**
   * Update shared variation description (creator only)
   */
  updateSharedVariation(id: string, description?: string): Promise<void>;

  /**
   * Unshare a theme (creator only)
   */
  unshareTheme(id: string): Promise<void>;

  /**
   * Unshare a variation (creator only)
   */
  unshareVariation(id: string): Promise<void>;

  // ==================== FAVORITE OPERATIONS (AUTH REQUIRED) ====================

  /**
   * Favorite a theme and create local copy
   */
  favoriteTheme(sharedThemeId: string): Promise<CopyToLocalResponse>;

  /**
   * Unfavorite a theme (keeps local copy)
   */
  unfavoriteTheme(sharedThemeId: string): Promise<void>;

  /**
   * Favorite a variation and create local copy
   */
  favoriteVariation(sharedVariationId: string): Promise<CopyToLocalResponse>;

  /**
   * Unfavorite a variation (keeps local copy)
   */
  unfavoriteVariation(sharedVariationId: string): Promise<void>;

  /**
   * Get user's favorites
   */
  getUserFavorites(): Promise<UserFavoritesResponse>;

  // ==================== COPY OPERATIONS (AUTH REQUIRED) ====================

  /**
   * Copy a shared theme to local without favoriting
   */
  copyThemeToLocal(sharedThemeId: string, customName?: string): Promise<CustomTheme>;

  /**
   * Copy a shared variation to local without favoriting
   */
  copyVariationToLocal(sharedVariationId: string, customName?: string): Promise<GameVariation>;
}