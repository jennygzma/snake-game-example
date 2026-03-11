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

/**
 * Hub service interface for sharing and discovering themes and variations
 */
export interface HubService {
  // Browse (public)
  browseThemes(params: HubSearchParams): Promise<HubThemesResponse>;
  browseVariations(params: HubSearchParams): Promise<HubVariationsResponse>;
  getSharedTheme(id: string): Promise<SharedThemeResponse>;
  getSharedVariation(id: string): Promise<SharedVariationResponse>;

  // Share/unshare (requires active profile)
  shareTheme(input: ShareThemeInput): Promise<ShareResponse>;
  shareVariation(input: ShareVariationInput): Promise<ShareResponse>;
  unshareTheme(sharedId: string): Promise<UnshareResponse>;
  unshareVariation(sharedId: string): Promise<UnshareResponse>;

  // Favorites (requires active profile)
  favoriteTheme(sharedId: string): Promise<FavoriteResponse>;
  unfavoriteTheme(sharedId: string): Promise<FavoriteResponse>;
  favoriteVariation(sharedId: string): Promise<FavoriteResponse>;
  unfavoriteVariation(sharedId: string): Promise<FavoriteResponse>;
  getUserFavorites(): Promise<UserFavorites>;

  // Copy to local (requires active profile)
  copyThemeToLocal(sharedId: string, customName?: string): Promise<CopyThemeResponse>;
  copyVariationToLocal(sharedId: string, customName?: string): Promise<CopyVariationResponse>;
}