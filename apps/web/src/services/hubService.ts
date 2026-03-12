import type {
  HubSearchParams,
  HubThemesResponse,
  HubVariationsResponse,
  ShareThemeInput,
  ShareVariationInput,
  ShareResponse,
  CopyToLocalResponse,
  FavoritesResponse,
  CustomTheme,
  GameVariation
} from "@snake/contracts";

export interface HubService {
  /**
   * Browse shared themes
   */
  browseThemes(params: HubSearchParams): Promise<HubThemesResponse>;

  /**
   * Browse shared variations
   */
  browseVariations(params: HubSearchParams): Promise<HubVariationsResponse>;

  /**
   * Share a theme to the hub
   */
  shareTheme(input: ShareThemeInput): Promise<ShareResponse>;

  /**
   * Share a variation to the hub
   */
  shareVariation(input: ShareVariationInput): Promise<ShareResponse>;

  /**
   * Unshare a theme from the hub
   */
  unshareTheme(sharedId: string): Promise<void>;

  /**
   * Unshare a variation from the hub
   */
  unshareVariation(sharedId: string): Promise<void>;

  /**
   * Favorite a theme
   */
  favoriteTheme(sharedId: string): Promise<void>;

  /**
   * Unfavorite a theme
   */
  unfavoriteTheme(sharedId: string): Promise<void>;

  /**
   * Favorite a variation
   */
  favoriteVariation(sharedId: string): Promise<void>;

  /**
   * Unfavorite a variation
   */
  unfavoriteVariation(sharedId: string): Promise<void>;

  /**
   * Get user's favorites
   */
  getUserFavorites(): Promise<FavoritesResponse>;

  /**
   * Copy a shared theme to local collection
   */
  copyThemeToLocal(sharedId: string, customName?: string): Promise<CustomTheme>;

  /**
   * Copy a shared variation to local collection
   */
  copyVariationToLocal(sharedId: string, customName?: string): Promise<GameVariation>;
}