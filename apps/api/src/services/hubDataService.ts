import type { Database } from "better-sqlite3";
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
  CopyToLocalResponse
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
    // ==================== BROWSE OPERATIONS (PUBLIC) ====================

    /**
     * Browse shared themes with pagination
     */
    browseThemes(params: HubSearchParams): HubThemesResponse {
      const { themes: themeList, total } = hub.browseSharedThemes(params);
      
      const totalPages = Math.ceil(total / params.limit);
      
      return {
        themes: themeList,
        meta: {
          total,
          page: params.page,
          limit: params.limit,
          totalPages
        }
      };
    },

    /**
     * Browse shared variations with pagination
     */
    browseVariations(params: HubSearchParams): HubVariationsResponse {
      const { variations: variationList, total } = hub.browseSharedVariations(params);
      
      const totalPages = Math.ceil(total / params.limit);
      
      return {
        variations: variationList,
        meta: {
          total,
          page: params.page,
          limit: params.limit,
          totalPages
        }
      };
    },

    /**
     * Get a single shared theme (public)
     */
    getSharedTheme(id: string): HubThemeResponse | null {
      const theme = hub.getSharedTheme(id);
      if (!theme) return null;
      return { theme };
    },

    /**
     * Get a single shared variation (public)
     */
    getSharedVariation(id: string): HubVariationResponse | null {
      const variation = hub.getSharedVariation(id);
      if (!variation) return null;
      return { variation };
    },

    // ==================== SHARE OPERATIONS (AUTH REQUIRED) ====================

    /**
     * Share a theme to the hub
     */
    shareTheme(input: ShareThemeInput, profileId: string): ShareResponse {
      const sharedTheme = hub.shareTheme(input.themeId, profileId, input.description);
      
      if (!sharedTheme) {
        throw new Error("Theme not found or you don't have permission to share it");
      }

      return {
        sharedId: sharedTheme.id,
        message: "Theme shared successfully"
      };
    },

    /**
     * Share a variation to the hub
     */
    shareVariation(input: ShareVariationInput, profileId: string): ShareResponse {
      const sharedVariation = hub.shareVariation(
        input.variationId,
        profileId,
        input.description
      );
      
      if (!sharedVariation) {
        throw new Error("Variation not found or you don't have permission to share it");
      }

      return {
        sharedId: sharedVariation.id,
        message: "Variation shared successfully"
      };
    },

    /**
     * Update shared theme description
     */
    updateSharedTheme(id: string, profileId: string, description?: string): boolean {
      return hub.updateSharedTheme(id, profileId, description);
    },

    /**
     * Update shared variation description
     */
    updateSharedVariation(id: string, profileId: string, description?: string): boolean {
      return hub.updateSharedVariation(id, profileId, description);
    },

    /**
     * Unshare a theme
     */
    unshareTheme(id: string, profileId: string): boolean {
      return hub.unshareTheme(id, profileId);
    },

    /**
     * Unshare a variation
     */
    unshareVariation(id: string, profileId: string): boolean {
      return hub.unshareVariation(id, profileId);
    },

    // ==================== FAVORITE OPERATIONS (AUTH REQUIRED) ====================

    /**
     * Favorite a theme and create a local copy
     */
    favoriteTheme(sharedThemeId: string, profileId: string, userId: string): CopyToLocalResponse {
      // Get the shared theme
      const sharedTheme = hub.getSharedTheme(sharedThemeId);
      if (!sharedTheme) {
        throw new Error("Shared theme not found");
      }

      // Create local copy
      const localTheme = themes.create(userId, profileId, {
        name: `${sharedTheme.name} (Copy)`,
        fontFamily: sharedTheme.fontFamily,
        colors: sharedTheme.colors,
        iconColors: sharedTheme.iconColors
      });

      // Mark as favorited
      hub.favoriteTheme(profileId, sharedThemeId);

      // Increment usage count
      hub.incrementThemeUsageCount(sharedThemeId);

      return {
        localId: localTheme.id,
        name: localTheme.name
      };
    },

    /**
     * Unfavorite a theme (keeps local copy)
     */
    unfavoriteTheme(sharedThemeId: string, profileId: string): boolean {
      return hub.unfavoriteTheme(profileId, sharedThemeId);
    },

    /**
     * Favorite a variation and create a local copy
     */
    favoriteVariation(
      sharedVariationId: string,
      profileId: string
    ): CopyToLocalResponse {
      // Get the shared variation
      const sharedVariation = hub.getSharedVariation(sharedVariationId);
      if (!sharedVariation) {
        throw new Error("Shared variation not found");
      }

      // Create local copy
      const localVariation = variations.createVariation(profileId, {
        name: `${sharedVariation.name} (Copy)`,
        description: sharedVariation.description,
        difficulty: sharedVariation.difficulty,
        baseSpeed: sharedVariation.baseSpeed,
        gridSize: sharedVariation.gridSize,
        maxConcurrentFoods: sharedVariation.maxConcurrentFoods,
        snakeHeadImage: sharedVariation.snakeHeadImage,
        powerupTypes: sharedVariation.powerupTypes,
        customColors: sharedVariation.customColors
      });

      // Mark as favorited
      hub.favoriteVariation(profileId, sharedVariationId);

      // Increment usage count
      hub.incrementVariationUsageCount(sharedVariationId);

      return {
        localId: localVariation.id,
        name: localVariation.name
      };
    },

    /**
     * Unfavorite a variation (keeps local copy)
     */
    unfavoriteVariation(sharedVariationId: string, profileId: string): boolean {
      return hub.unfavoriteVariation(profileId, sharedVariationId);
    },

    /**
     * Get user's favorites
     */
    getUserFavorites(profileId: string): UserFavoritesResponse {
      const themeIds = hub.getUserFavoriteThemeIds(profileId);
      const variationIds = hub.getUserFavoriteVariationIds(profileId);

      return { themeIds, variationIds };
    },

    // ==================== COPY OPERATIONS (AUTH REQUIRED) ====================

    /**
     * Copy a shared theme to local without favoriting
     */
    copyThemeToLocal(
      sharedThemeId: string,
      profileId: string,
      userId: string,
      customName?: string
    ): CopyToLocalResponse {
      // Get the shared theme
      const sharedTheme = hub.getSharedTheme(sharedThemeId);
      if (!sharedTheme) {
        throw new Error("Shared theme not found");
      }

      // Create local copy
      const localTheme = themes.create(userId, profileId, {
        name: customName || `${sharedTheme.name} (Copy)`,
        fontFamily: sharedTheme.fontFamily,
        colors: sharedTheme.colors,
        iconColors: sharedTheme.iconColors
      });

      // Increment usage count
      hub.incrementThemeUsageCount(sharedThemeId);

      return {
        localId: localTheme.id,
        name: localTheme.name
      };
    },

    /**
     * Copy a shared variation to local without favoriting
     */
    copyVariationToLocal(
      sharedVariationId: string,
      profileId: string,
      customName?: string
    ): CopyToLocalResponse {
      // Get the shared variation
      const sharedVariation = hub.getSharedVariation(sharedVariationId);
      if (!sharedVariation) {
        throw new Error("Shared variation not found");
      }

      // Create local copy
      const localVariation = variations.createVariation(profileId, {
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
        localId: localVariation.id,
        name: localVariation.name
      };
    }
  };
};