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
  UnfavoriteResponse,
  UserFavoritesResponse,
  CopyThemeToLocalResponse,
  CopyVariationToLocalResponse,
  CustomTheme,
  GameVariation
} from "@snake/contracts";

export interface HubService {
  // ==================== Public Browse Operations ====================

  /**
   * Browse shared themes with search/filter/pagination
   */
  browseThemes(params: HubSearchParams): Promise<HubThemesResponse>;

  /**
   * Browse shared variations with search/filter/pagination
   */
  browseVariations(params: HubSearchParams): Promise<HubVariationsResponse>;

  /**
   * Get a single shared theme
   */
  getSharedTheme(id: string): Promise<SharedThemeResponse | null>;

  /**
   * Get a single shared variation
   */
  getSharedVariation(id: string): Promise<SharedVariationResponse | null>;

  // ==================== Creator Operations (Auth Required) ====================

  /**
   * Share a theme to the hub
   */
  shareTheme(input: ShareThemeInput): Promise<ShareResponse>;

  /**
   * Share a variation to the hub
   */
  shareVariation(input: ShareVariationInput): Promise<ShareResponse>;

  /**
   * Update a shared theme's description (creator only)
   */
  updateSharedTheme(id: string, description: string): Promise<UnshareResponse>;

  /**
   * Update a shared variation's description (creator only)
   */
  updateSharedVariation(id: string, description: string): Promise<UnshareResponse>;

  /**
   * Unshare a theme from the hub (creator only)
   */
  unshareTheme(id: string): Promise<UnshareResponse>;

  /**
   * Unshare a variation from the hub (creator only)
   */
  unshareVariation(id: string): Promise<UnshareResponse>;

  // ==================== Favorite Operations (Auth Required) ====================

  /**
   * Favorite a shared theme
   */
  favoriteTheme(sharedThemeId: string): Promise<FavoriteResponse>;

  /**
   * Unfavorite a shared theme
   */
  unfavoriteTheme(sharedThemeId: string): Promise<UnfavoriteResponse>;

  /**
   * Favorite a shared variation
   */
  favoriteVariation(sharedVariationId: string): Promise<FavoriteResponse>;

  /**
   * Unfavorite a shared variation
   */
  unfavoriteVariation(sharedVariationId: string): Promise<UnfavoriteResponse>;

  /**
   * Get all favorites for the user
   */
  getUserFavorites(): Promise<UserFavoritesResponse>;

  // ==================== Copy to Local Operations (Auth Required) ====================

  /**
   * Copy a shared theme to the user's local collection
   */
  copyThemeToLocal(sharedThemeId: string, customName?: string): Promise<CustomTheme>;

  /**
   * Copy a shared variation to the user's local collection
   */
  copyVariationToLocal(sharedVariationId: string, customName?: string): Promise<GameVariation>;
}