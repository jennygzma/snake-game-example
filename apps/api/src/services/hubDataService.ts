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
  UnfavoriteResponse,
  UserFavoritesResponse,
  PaginationMeta
} from "@snake/contracts";
import { hubQueries } from "../db/hubQueries";
import { themeQueries } from "../db/themeQueries";
import { variationQueries } from "../db/variationQueries";

export const createHubDataService = (db: Database) => {
  const queries = hubQueries(db);
  const themeQs = themeQueries(db);
  const variationQs = variationQueries(db);

  return {
    // ==================== Public Browse Operations ====================

    /**
     * Browse shared themes with search/filter/pagination
     */
    browseThemes(params: HubSearchParams): HubThemesResponse {
      const { themes, total } = queries.browseSharedThemes(params);
      const { page = 1, limit = 20 } = params;
      
      const pagination: PaginationMeta = {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };

      return { themes, pagination };
    },

    /**
     * Browse shared variations with search/filter/pagination
     */
    browseVariations(params: HubSearchParams): HubVariationsResponse {
      const { variations, total } = queries.browseSharedVariations(params);
      const { page = 1, limit = 20 } = params;
      
      const pagination: PaginationMeta = {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };

      return { variations, pagination };
    },

    /**
     * Get a single shared theme
     */
    getSharedTheme(id: string): SharedThemeResponse | null {
      const theme = queries.getSharedTheme(id);
      if (!theme) return null;
      return { theme };
    },

    /**
     * Get a single shared variation
     */
    getSharedVariation(id: string): SharedVariationResponse | null {
      const variation = queries.getSharedVariation(id);
      if (!variation) return null;
      return { variation };
    },

    // ==================== Creator Operations (Auth Required) ====================

    /**
     * Share a theme to the hub
     */
    shareTheme(creatorProfileId: string, input: ShareThemeInput): ShareResponse | null {
      const { themeId, description } = input;
      
      const sharedTheme = queries.shareTheme(creatorProfileId, themeId, description);
      if (!sharedTheme) {
        return null;
      }

      return {
        sharedId: sharedTheme.id,
        message: `Theme "${sharedTheme.name}" shared to hub successfully`
      };
    },

    /**
     * Share a variation to the hub
     */
    shareVariation(creatorProfileId: string, input: ShareVariationInput): ShareResponse | null {
      const { variationId, description } = input;
      
      const sharedVariation = queries.shareVariation(creatorProfileId, variationId, description);
      if (!sharedVariation) {
        return null;
      }

      return {
        sharedId: sharedVariation.id,
        message: `Variation "${sharedVariation.name}" shared to hub successfully`
      };
    },

    /**
     * Update a shared theme's description (creator only)
     */
    updateSharedTheme(id: string, creatorProfileId: string, description: string): UnshareResponse | null {
      const success = queries.updateSharedTheme(id, creatorProfileId, description);
      if (!success) return null;
      
      return { message: "Shared theme updated successfully" };
    },

    /**
     * Update a shared variation's description (creator only)
     */
    updateSharedVariation(id: string, creatorProfileId: string, description: string): UnshareResponse | null {
      const success = queries.updateSharedVariation(id, creatorProfileId, description);
      if (!success) return null;
      
      return { message: "Shared variation updated successfully" };
    },

    /**
     * Unshare a theme from the hub (creator only)
     */
    unshareTheme(id: string, creatorProfileId: string): UnshareResponse | null {
      const success = queries.unshareTheme(id, creatorProfileId);
      if (!success) return null;
      
      return { message: "Theme unshared from hub successfully" };
    },

    /**
     * Unshare a variation from the hub (creator only)
     */
    unshareVariation(id: string, creatorProfileId: string): UnshareResponse | null {
      const success = queries.unshareVariation(id, creatorProfileId);
      if (!success) return null;
      
      return { message: "Variation unshared from hub successfully" };
    },

    // ==================== Favorite Operations (Auth Required) ====================

    /**
     * Favorite a shared theme
     */
    favoriteTheme(profileId: string, sharedThemeId: string): FavoriteResponse | null {
      const success = queries.favoriteTheme(profileId, sharedThemeId);
      if (!success) return null;
      
      const theme = queries.getSharedTheme(sharedThemeId);
      return {
        message: "Theme added to favorites",
        favoriteCount: theme?.favoriteCount ?? 0
      };
    },

    /**
     * Unfavorite a shared theme
     */
    unfavoriteTheme(profileId: string, sharedThemeId: string): UnfavoriteResponse | null {
      const success = queries.unfavoriteTheme(profileId, sharedThemeId);
      if (!success) return null;
      
      const theme = queries.getSharedTheme(sharedThemeId);
      return {
        message: "Theme removed from favorites",
        favoriteCount: theme?.favoriteCount ?? 0
      };
    },

    /**
     * Favorite a shared variation
     */
    favoriteVariation(profileId: string, sharedVariationId: string): FavoriteResponse | null {
      const success = queries.favoriteVariation(profileId, sharedVariationId);
      if (!success) return null;
      
      const variation = queries.getSharedVariation(sharedVariationId);
      return {
        message: "Variation added to favorites",
        favoriteCount: variation?.favoriteCount ?? 0
      };
    },

    /**
     * Unfavorite a shared variation
     */
    unfavoriteVariation(profileId: string, sharedVariationId: string): UnfavoriteResponse | null {
      const success = queries.unfavoriteVariation(profileId, sharedVariationId);
      if (!success) return null;
      
      const variation = queries.getSharedVariation(sharedVariationId);
      return {
        message: "Variation removed from favorites",
        favoriteCount: variation?.favoriteCount ?? 0
      };
    },

    /**
     * Get all favorites for a user
     */
    getUserFavorites(profileId: string): UserFavoritesResponse {
      return queries.getUserFavorites(profileId);
    },

    // ==================== Copy to Local Operations (Auth Required) ====================

    /**
     * Copy a shared theme to the user's local collection
     */
    copyThemeToLocal(sharedThemeId: string, userId: string, profileId: string, customName?: string) {
      const sharedTheme = queries.getSharedTheme(sharedThemeId);
      if (!sharedTheme) {
        throw new Error("Shared theme not found");
      }

      // Create local copy
      const localTheme = themeQs.create(userId, profileId, {
        name: customName || `${sharedTheme.name} (Copy)`,
        fontFamily: sharedTheme.fontFamily,
        colors: sharedTheme.colors,
        iconColors: sharedTheme.iconColors
      });

      // Increment usage count
      queries.incrementThemeUsageCount(sharedThemeId);

      return {
        localThemeId: localTheme.id,
        message: `Theme "${localTheme.name}" copied to your collection`
      };
    },

    /**
     * Copy a shared variation to the user's local collection
     */
    copyVariationToLocal(sharedVariationId: string, profileId: string, customName?: string) {
      const sharedVariation = queries.getSharedVariation(sharedVariationId);
      if (!sharedVariation) {
        throw new Error("Shared variation not found");
      }

      // Create local copy
      const localVariation = variationQs.createVariation(profileId, {
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
      queries.incrementVariationUsageCount(sharedVariationId);

      return {
        localVariationId: localVariation.id,
        message: `Variation "${localVariation.name}" copied to your collection`
      };
    }
  };
};