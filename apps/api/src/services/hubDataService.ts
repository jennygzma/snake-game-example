import type { Database } from "better-sqlite3";
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
import { hubQueries } from "../db/hubQueries";
import { themeQueries } from "../db/themeQueries";
import { variationQueries } from "../db/variationQueries";
import { profileQueries } from "../db/profileQueries";

export const createHubDataService = (db: Database) => {
  const hub = hubQueries(db);
  const themes = themeQueries(db);
  const variations = variationQueries(db);
  const profiles = profileQueries(db);

  return {
    // ============ BROWSE (PUBLIC) ============

    /**
     * Browse shared themes (public endpoint)
     */
    browseThemes(params: HubSearchParams, currentProfileId?: string): HubThemesResponse {
      const result = hub.browseSharedThemes(params, currentProfileId);
      const { page = 1, limit = 20 } = params;

      return {
        themes: result.themes,
        total: result.total,
        page,
        limit,
        hasMore: page * limit < result.total
      };
    },

    /**
     * Browse shared variations (public endpoint)
     */
    browseVariations(params: HubSearchParams, currentProfileId?: string): HubVariationsResponse {
      const result = hub.browseSharedVariations(params, currentProfileId);
      const { page = 1, limit = 20 } = params;

      return {
        variations: result.variations,
        total: result.total,
        page,
        limit,
        hasMore: page * limit < result.total
      };
    },

    /**
     * Get a single shared theme (public endpoint)
     */
    getSharedTheme(id: string, currentProfileId?: string): SharedThemeResponse | null {
      const theme = hub.getSharedTheme(id, currentProfileId);
      if (!theme) return null;
      return { theme };
    },

    /**
     * Get a single shared variation (public endpoint)
     */
    getSharedVariation(id: string, currentProfileId?: string): SharedVariationResponse | null {
      const variation = hub.getSharedVariation(id, currentProfileId);
      if (!variation) return null;
      return { variation };
    },

    // ============ SHARE (AUTH REQUIRED) ============

    /**
     * Share a theme from local themes to hub
     */
    shareTheme(input: ShareThemeInput): ShareResponse {
      const activeProfile = profiles.getActive();
      if (!activeProfile) {
        throw new Error("NO_ACTIVE_PROFILE");
      }

      // Get the local theme
      const localTheme = themes.getById(input.themeId);
      if (!localTheme) {
        throw new Error("THEME_NOT_FOUND");
      }

      // Create shared theme
      const sharedTheme = hub.shareTheme(activeProfile.id, {
        name: localTheme.name,
        description: input.description,
        fontFamily: localTheme.fontFamily,
        colors: localTheme.colors,
        iconColors: localTheme.iconColors
      });

      return {
        sharedId: sharedTheme.id,
        message: `Theme "${localTheme.name}" shared to hub successfully`
      };
    },

    /**
     * Share a variation from local variations to hub
     */
    shareVariation(input: ShareVariationInput): ShareResponse {
      const activeProfile = profiles.getActive();
      if (!activeProfile) {
        throw new Error("NO_ACTIVE_PROFILE");
      }

      // Get the local variation
      const localVariation = variations.getVariationById(input.variationId);
      if (!localVariation || localVariation.profileId !== activeProfile.id) {
        throw new Error("VARIATION_NOT_FOUND");
      }

      // Create shared variation
      const sharedVariation = hub.shareVariation(activeProfile.id, {
        name: localVariation.name,
        description: input.description,
        difficulty: localVariation.difficulty,
        baseSpeed: localVariation.baseSpeed,
        gridSize: localVariation.gridSize,
        maxConcurrentFoods: localVariation.maxConcurrentFoods,
        snakeHeadImage: localVariation.snakeHeadImage,
        powerupTypes: localVariation.powerupTypes,
        customColors: localVariation.customColors
      });

      return {
        sharedId: sharedVariation.id,
        message: `Variation "${localVariation.name}" shared to hub successfully`
      };
    },

    /**
     * Unshare a theme (creator only)
     */
    unshareTheme(sharedId: string): UnshareResponse {
      const activeProfile = profiles.getActive();
      if (!activeProfile) {
        throw new Error("NO_ACTIVE_PROFILE");
      }

      const sharedTheme = hub.getSharedTheme(sharedId);
      if (!sharedTheme) {
        throw new Error("SHARED_THEME_NOT_FOUND");
      }

      if (sharedTheme.creatorProfileId !== activeProfile.id) {
        throw new Error("NOT_CREATOR");
      }

      const success = hub.unshareTheme(sharedId);
      return {
        success,
        message: success ? "Theme unshared successfully" : "Failed to unshare theme"
      };
    },

    /**
     * Unshare a variation (creator only)
     */
    unshareVariation(sharedId: string): UnshareResponse {
      const activeProfile = profiles.getActive();
      if (!activeProfile) {
        throw new Error("NO_ACTIVE_PROFILE");
      }

      const sharedVariation = hub.getSharedVariation(sharedId);
      if (!sharedVariation) {
        throw new Error("SHARED_VARIATION_NOT_FOUND");
      }

      if (sharedVariation.creatorProfileId !== activeProfile.id) {
        throw new Error("NOT_CREATOR");
      }

      const success = hub.unshareVariation(sharedId);
      return {
        success,
        message: success ? "Variation unshared successfully" : "Failed to unshare variation"
      };
    },

    // ============ FAVORITES (AUTH REQUIRED) ============

    /**
     * Favorite a shared theme
     */
    favoriteTheme(sharedThemeId: string): FavoriteResponse {
      const activeProfile = profiles.getActive();
      if (!activeProfile) {
        throw new Error("NO_ACTIVE_PROFILE");
      }

      const success = hub.favoriteTheme(activeProfile.id, sharedThemeId);
      const sharedTheme = hub.getSharedTheme(sharedThemeId);

      return {
        success,
        favoriteCount: sharedTheme?.favoriteCount ?? 0
      };
    },

    /**
     * Unfavorite a shared theme
     */
    unfavoriteTheme(sharedThemeId: string): FavoriteResponse {
      const activeProfile = profiles.getActive();
      if (!activeProfile) {
        throw new Error("NO_ACTIVE_PROFILE");
      }

      const success = hub.unfavoriteTheme(activeProfile.id, sharedThemeId);
      const sharedTheme = hub.getSharedTheme(sharedThemeId);

      return {
        success,
        favoriteCount: sharedTheme?.favoriteCount ?? 0
      };
    },

    /**
     * Favorite a shared variation
     */
    favoriteVariation(sharedVariationId: string): FavoriteResponse {
      const activeProfile = profiles.getActive();
      if (!activeProfile) {
        throw new Error("NO_ACTIVE_PROFILE");
      }

      const success = hub.favoriteVariation(activeProfile.id, sharedVariationId);
      const sharedVariation = hub.getSharedVariation(sharedVariationId);

      return {
        success,
        favoriteCount: sharedVariation?.favoriteCount ?? 0
      };
    },

    /**
     * Unfavorite a shared variation
     */
    unfavoriteVariation(sharedVariationId: string): FavoriteResponse {
      const activeProfile = profiles.getActive();
      if (!activeProfile) {
        throw new Error("NO_ACTIVE_PROFILE");
      }

      const success = hub.unfavoriteVariation(activeProfile.id, sharedVariationId);
      const sharedVariation = hub.getSharedVariation(sharedVariationId);

      return {
        success,
        favoriteCount: sharedVariation?.favoriteCount ?? 0
      };
    },

    /**
     * Get user's favorites
     */
    getUserFavorites(): UserFavorites {
      const activeProfile = profiles.getActive();
      if (!activeProfile) {
        throw new Error("NO_ACTIVE_PROFILE");
      }

      return hub.getUserFavorites(activeProfile.id);
    },

    // ============ COPY TO LOCAL (AUTH REQUIRED) ============

    /**
     * Copy a shared theme to user's local themes
     */
    copyThemeToLocal(sharedThemeId: string, customName?: string): CopyThemeResponse {
      const activeProfile = profiles.getActive();
      if (!activeProfile) {
        throw new Error("NO_ACTIVE_PROFILE");
      }

      const sharedTheme = hub.getSharedTheme(sharedThemeId);
      if (!sharedTheme) {
        throw new Error("SHARED_THEME_NOT_FOUND");
      }

      // Create local copy with optional custom name
      const localTheme = themes.create("user", activeProfile.id, {
        name: customName || `${sharedTheme.name} (Copy)`,
        fontFamily: sharedTheme.fontFamily,
        colors: sharedTheme.colors,
        iconColors: sharedTheme.iconColors
      });

      // Increment usage count
      hub.incrementThemeUsageCount(sharedThemeId);

      return {
        themeId: localTheme.id,
        message: `Theme copied to your local themes as "${localTheme.name}"`
      };
    },

    /**
     * Copy a shared variation to user's local variations
     */
    copyVariationToLocal(sharedVariationId: string, customName?: string): CopyVariationResponse {
      const activeProfile = profiles.getActive();
      if (!activeProfile) {
        throw new Error("NO_ACTIVE_PROFILE");
      }

      const sharedVariation = hub.getSharedVariation(sharedVariationId);
      if (!sharedVariation) {
        throw new Error("SHARED_VARIATION_NOT_FOUND");
      }

      // Create local copy with optional custom name
      const localVariation = variations.createVariation(activeProfile.id, {
        name: customName || `${sharedVariation.name} (Copy)`,
        description: sharedVariation.description,
        difficulty: sharedVariation.difficulty,
        baseSpeed: sharedVariation.baseSpeed,
        gridSize: sharedVariation.gridSize,
        maxConcurrentFoods: sharedVariation.maxConcurrentFoods,
        snakeHeadImage: sharedVariation.snakeHeadImage,
        powerupTypes: sharedVariation.powerupTypes,
        customColors: sharedVariation.customColors
      });

      // Increment usage count
      hub.incrementVariationUsageCount(sharedVariationId);

      return {
        variationId: localVariation.id,
        message: `Variation copied to your local variations as "${localVariation.name}"`
      };
    }
  };
};