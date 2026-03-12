import type { Database } from "better-sqlite3";
import type {
  HubSearchParams,
  HubThemesResponse,
  HubVariationsResponse,
  ShareThemeInput,
  ShareVariationInput,
  UpdateSharedThemeInput,
  UpdateSharedVariationInput,
  ShareResponse,
  CopyToLocalResponse,
  FavoritesResponse
} from "@snake/contracts";
import { hubQueries } from "../db/hubQueries";
import { profileQueries } from "../db/profileQueries";

export const createHubDataService = (db: Database) => {
  const hubQs = hubQueries(db);
  const profileQs = profileQueries(db);

  return {
    // ========================================================================
    // Browse & Discovery
    // ========================================================================

    /**
     * Browse shared themes with pagination
     */
    browseThemes(params: HubSearchParams, requestingProfileId?: string): HubThemesResponse {
      const { themes, total } = hubQs.browseSharedThemes(params, requestingProfileId);
      const { page = 1, limit = 20 } = params;

      return {
        themes,
        total,
        page,
        limit,
        hasMore: page * limit < total
      };
    },

    /**
     * Browse shared variations with pagination
     */
    browseVariations(
      params: HubSearchParams,
      requestingProfileId?: string
    ): HubVariationsResponse {
      const { variations, total } = hubQs.browseSharedVariations(params, requestingProfileId);
      const { page = 1, limit = 20 } = params;

      return {
        variations,
        total,
        page,
        limit,
        hasMore: page * limit < total
      };
    },

    /**
     * Get a specific shared theme
     */
    getSharedTheme(id: string, requestingProfileId?: string) {
      return hubQs.getSharedTheme(id, requestingProfileId);
    },

    /**
     * Get a specific shared variation
     */
    getSharedVariation(id: string, requestingProfileId?: string) {
      return hubQs.getSharedVariation(id, requestingProfileId);
    },

    // ========================================================================
    // Share Operations
    // ========================================================================

    /**
     * Share a theme to the hub
     */
    shareTheme(input: ShareThemeInput): ShareResponse {
      const activeProfile = profileQs.getActive();
      if (!activeProfile) {
        throw new Error("No active profile found");
      }

      const shared = hubQs.shareTheme(activeProfile.id, input.themeId, input.description);

      return {
        sharedId: shared.id,
        message: "Theme shared successfully"
      };
    },

    /**
     * Share a variation to the hub
     */
    shareVariation(input: ShareVariationInput): ShareResponse {
      const activeProfile = profileQs.getActive();
      if (!activeProfile) {
        throw new Error("No active profile found");
      }

      const shared = hubQs.shareVariation(
        activeProfile.id,
        input.variationId,
        input.description
      );

      return {
        sharedId: shared.id,
        message: "Variation shared successfully"
      };
    },

    /**
     * Update a shared theme
     */
    updateSharedTheme(id: string, input: UpdateSharedThemeInput) {
      // Verify ownership
      const activeProfile = profileQs.getActive();
      if (!activeProfile) {
        throw new Error("No active profile found");
      }

      const shared = hubQs.getSharedTheme(id);
      if (!shared) {
        throw new Error("Shared theme not found");
      }

      if (shared.creatorProfileId !== activeProfile.id) {
        throw new Error("Not authorized to update this theme");
      }

      return hubQs.updateSharedTheme(id, input.description);
    },

    /**
     * Update a shared variation
     */
    updateSharedVariation(id: string, input: UpdateSharedVariationInput) {
      // Verify ownership
      const activeProfile = profileQs.getActive();
      if (!activeProfile) {
        throw new Error("No active profile found");
      }

      const shared = hubQs.getSharedVariation(id);
      if (!shared) {
        throw new Error("Shared variation not found");
      }

      if (shared.creatorProfileId !== activeProfile.id) {
        throw new Error("Not authorized to update this variation");
      }

      return hubQs.updateSharedVariation(id, input.description);
    },

    /**
     * Unshare a theme
     */
    unshareTheme(id: string): boolean {
      // Verify ownership
      const activeProfile = profileQs.getActive();
      if (!activeProfile) {
        throw new Error("No active profile found");
      }

      const shared = hubQs.getSharedTheme(id);
      if (!shared) {
        throw new Error("Shared theme not found");
      }

      if (shared.creatorProfileId !== activeProfile.id) {
        throw new Error("Not authorized to unshare this theme");
      }

      return hubQs.unshareTheme(id);
    },

    /**
     * Unshare a variation
     */
    unshareVariation(id: string): boolean {
      // Verify ownership
      const activeProfile = profileQs.getActive();
      if (!activeProfile) {
        throw new Error("No active profile found");
      }

      const shared = hubQs.getSharedVariation(id);
      if (!shared) {
        throw new Error("Shared variation not found");
      }

      if (shared.creatorProfileId !== activeProfile.id) {
        throw new Error("Not authorized to unshare this variation");
      }

      return hubQs.unshareVariation(id);
    },

    // ========================================================================
    // Favorite Operations
    // ========================================================================

    /**
     * Favorite a theme
     */
    favoriteTheme(sharedThemeId: string): void {
      const activeProfile = profileQs.getActive();
      if (!activeProfile) {
        throw new Error("No active profile found");
      }

      hubQs.favoriteTheme(activeProfile.id, sharedThemeId);
    },

    /**
     * Unfavorite a theme
     */
    unfavoriteTheme(sharedThemeId: string): void {
      const activeProfile = profileQs.getActive();
      if (!activeProfile) {
        throw new Error("No active profile found");
      }

      hubQs.unfavoriteTheme(activeProfile.id, sharedThemeId);
    },

    /**
     * Favorite a variation
     */
    favoriteVariation(sharedVariationId: string): void {
      const activeProfile = profileQs.getActive();
      if (!activeProfile) {
        throw new Error("No active profile found");
      }

      hubQs.favoriteVariation(activeProfile.id, sharedVariationId);
    },

    /**
     * Unfavorite a variation
     */
    unfavoriteVariation(sharedVariationId: string): void {
      const activeProfile = profileQs.getActive();
      if (!activeProfile) {
        throw new Error("No active profile found");
      }

      hubQs.unfavoriteVariation(activeProfile.id, sharedVariationId);
    },

    /**
     * Get user's favorites
     */
    getUserFavorites(): FavoritesResponse {
      const activeProfile = profileQs.getActive();
      if (!activeProfile) {
        throw new Error("No active profile found");
      }

      return hubQs.getUserFavorites(activeProfile.id);
    },

    // ========================================================================
    // Copy Operations
    // ========================================================================

    /**
     * Copy a shared theme to local
     */
    copyThemeToLocal(sharedThemeId: string, customName?: string): CopyToLocalResponse {
      const activeProfile = profileQs.getActive();
      if (!activeProfile) {
        throw new Error("No active profile found");
      }

      const localId = hubQs.copyThemeToLocal(sharedThemeId, activeProfile.id, customName);

      return {
        localId,
        message: "Theme copied to your collection"
      };
    },

    /**
     * Copy a shared variation to local
     */
    copyVariationToLocal(sharedVariationId: string, customName?: string): CopyToLocalResponse {
      const activeProfile = profileQs.getActive();
      if (!activeProfile) {
        throw new Error("No active profile found");
      }

      const localId = hubQs.copyVariationToLocal(sharedVariationId, activeProfile.id, customName);

      return {
        localId,
        message: "Variation copied to your collection"
      };
    }
  };
};