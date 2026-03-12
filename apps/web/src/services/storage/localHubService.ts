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
  UserFavorites,
  SharedTheme,
  SharedVariation,
  SharedThemeWithCreator,
  SharedVariationWithCreator
} from "@snake/contracts";

const SHARED_THEMES_KEY = "snake_shared_themes";
const SHARED_VARIATIONS_KEY = "snake_shared_variations";
const THEME_FAVORITES_KEY = "snake_theme_favorites";
const VARIATION_FAVORITES_KEY = "snake_variation_favorites";

// Helper to get active profile for creator info
function getActiveProfile() {
  const profilesData = localStorage.getItem("snake_profiles");
  if (!profilesData) return null;
  
  const profiles = JSON.parse(profilesData);
  return profiles.find((p: { isActive: boolean }) => p.isActive) || null;
}

// Helper to get local theme by ID
function getLocalTheme(themeId: string) {
  const themesData = localStorage.getItem("snake_themes");
  if (!themesData) return null;
  
  const themes = JSON.parse(themesData);
  return themes.find((t: { id: string }) => t.id === themeId) || null;
}

// Helper to get local variation by ID
function getLocalVariation(variationId: string) {
  const variationsData = localStorage.getItem("snake_game_variations");
  if (!variationsData) return null;
  
  const variations = JSON.parse(variationsData);
  return variations.find((v: { id: string }) => v.id === variationId) || null;
}

export const localHubService: HubService = {
  // ============ BROWSE (PUBLIC) ============

  async browseThemes(params: HubSearchParams): Promise<HubThemesResponse> {
    const data = localStorage.getItem(SHARED_THEMES_KEY);
    const sharedThemes: SharedTheme[] = data ? JSON.parse(data) : [];
    const favoritesData = localStorage.getItem(THEME_FAVORITES_KEY);
    const favorites: string[] = favoritesData ? JSON.parse(favoritesData) : [];

    // Filter by query
    let filtered = sharedThemes;
    if (params.query) {
      const query = params.query.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query))
      );
    }

    // Sort
    const sortBy = params.sortBy || "newest";
    filtered.sort((a, b) => {
      if (sortBy === "popular") {
        return b.usageCount - a.usageCount || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "favorites") {
        return b.favoriteCount - a.favoriteCount || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Paginate
    const page = params.page || 1;
    const limit = params.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    // Get profiles for creator info
    const profilesData = localStorage.getItem("snake_profiles");
    const profiles = profilesData ? JSON.parse(profilesData) : [];

    const themesWithCreator: SharedThemeWithCreator[] = paginated.map((theme) => {
      const creator = profiles.find((p: { id: string }) => p.id === theme.creatorProfileId) || {
        id: theme.creatorProfileId,
        name: "Unknown",
        avatarBase64: undefined
      };

      return {
        ...theme,
        creator: {
          profileId: creator.id,
          profileName: creator.name,
          avatarBase64: creator.avatarBase64
        },
        isFavorited: favorites.includes(theme.id)
      };
    });

    return {
      themes: themesWithCreator,
      total: filtered.length,
      page,
      limit,
      hasMore: end < filtered.length
    };
  },

  async browseVariations(params: HubSearchParams): Promise<HubVariationsResponse> {
    const data = localStorage.getItem(SHARED_VARIATIONS_KEY);
    const sharedVariations: SharedVariation[] = data ? JSON.parse(data) : [];
    const favoritesData = localStorage.getItem(VARIATION_FAVORITES_KEY);
    const favorites: string[] = favoritesData ? JSON.parse(favoritesData) : [];

    // Filter by query and difficulty
    let filtered = sharedVariations;
    if (params.query) {
      const query = params.query.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          (v.description && v.description.toLowerCase().includes(query))
      );
    }
    if (params.difficulty) {
      filtered = filtered.filter((v) => v.difficulty === params.difficulty);
    }

    // Sort
    const sortBy = params.sortBy || "newest";
    filtered.sort((a, b) => {
      if (sortBy === "popular") {
        return b.usageCount - a.usageCount || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "favorites") {
        return b.favoriteCount - a.favoriteCount || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Paginate
    const page = params.page || 1;
    const limit = params.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    // Get profiles for creator info
    const profilesData = localStorage.getItem("snake_profiles");
    const profiles = profilesData ? JSON.parse(profilesData) : [];

    const variationsWithCreator: SharedVariationWithCreator[] = paginated.map((variation) => {
      const creator = profiles.find((p: { id: string }) => p.id === variation.creatorProfileId) || {
        id: variation.creatorProfileId,
        name: "Unknown",
        avatarBase64: undefined
      };

      return {
        ...variation,
        creator: {
          profileId: creator.id,
          profileName: creator.name,
          avatarBase64: creator.avatarBase64
        },
        isFavorited: favorites.includes(variation.id)
      };
    });

    return {
      variations: variationsWithCreator,
      total: filtered.length,
      page,
      limit,
      hasMore: end < filtered.length
    };
  },

  async getSharedTheme(id: string): Promise<SharedThemeResponse> {
    const data = localStorage.getItem(SHARED_THEMES_KEY);
    const sharedThemes: SharedTheme[] = data ? JSON.parse(data) : [];
    const theme = sharedThemes.find((t) => t.id === id);

    if (!theme) {
      throw new Error("Shared theme not found");
    }

    const profilesData = localStorage.getItem("snake_profiles");
    const profiles = profilesData ? JSON.parse(profilesData) : [];
    const creator = profiles.find((p: { id: string }) => p.id === theme.creatorProfileId) || {
      id: theme.creatorProfileId,
      name: "Unknown",
      avatarBase64: undefined
    };

    const favoritesData = localStorage.getItem(THEME_FAVORITES_KEY);
    const favorites: string[] = favoritesData ? JSON.parse(favoritesData) : [];

    return {
      theme: {
        ...theme,
        creator: {
          profileId: creator.id,
          profileName: creator.name,
          avatarBase64: creator.avatarBase64
        },
        isFavorited: favorites.includes(theme.id)
      }
    };
  },

  async getSharedVariation(id: string): Promise<SharedVariationResponse> {
    const data = localStorage.getItem(SHARED_VARIATIONS_KEY);
    const sharedVariations: SharedVariation[] = data ? JSON.parse(data) : [];
    const variation = sharedVariations.find((v) => v.id === id);

    if (!variation) {
      throw new Error("Shared variation not found");
    }

    const profilesData = localStorage.getItem("snake_profiles");
    const profiles = profilesData ? JSON.parse(profilesData) : [];
    const creator = profiles.find((p: { id: string }) => p.id === variation.creatorProfileId) || {
      id: variation.creatorProfileId,
      name: "Unknown",
      avatarBase64: undefined
    };

    const favoritesData = localStorage.getItem(VARIATION_FAVORITES_KEY);
    const favorites: string[] = favoritesData ? JSON.parse(favoritesData) : [];

    return {
      variation: {
        ...variation,
        creator: {
          profileId: creator.id,
          profileName: creator.name,
          avatarBase64: creator.avatarBase64
        },
        isFavorited: favorites.includes(variation.id)
      }
    };
  },

  // ============ SHARE/UNSHARE (AUTH REQUIRED) ============

  async shareTheme(input: ShareThemeInput): Promise<ShareResponse> {
    const activeProfile = getActiveProfile();
    if (!activeProfile) {
      throw new Error("No active profile");
    }

    const localTheme = getLocalTheme(input.themeId);
    if (!localTheme) {
      throw new Error("Theme not found");
    }

    const data = localStorage.getItem(SHARED_THEMES_KEY);
    const sharedThemes: SharedTheme[] = data ? JSON.parse(data) : [];

    const sharedTheme: SharedTheme = {
      id: crypto.randomUUID(),
      creatorProfileId: activeProfile.id,
      name: localTheme.name,
      description: input.description,
      fontFamily: localTheme.fontFamily,
      colors: localTheme.colors,
      iconColors: localTheme.iconColors,
      favoriteCount: 0,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    sharedThemes.push(sharedTheme);
    localStorage.setItem(SHARED_THEMES_KEY, JSON.stringify(sharedThemes));

    return {
      sharedId: sharedTheme.id,
      message: `Theme "${localTheme.name}" shared to hub successfully`
    };
  },

  async shareVariation(input: ShareVariationInput): Promise<ShareResponse> {
    const activeProfile = getActiveProfile();
    if (!activeProfile) {
      throw new Error("No active profile");
    }

    const localVariation = getLocalVariation(input.variationId);
    if (!localVariation) {
      throw new Error("Variation not found");
    }

    const data = localStorage.getItem(SHARED_VARIATIONS_KEY);
    const sharedVariations: SharedVariation[] = data ? JSON.parse(data) : [];

    const sharedVariation: SharedVariation = {
      id: crypto.randomUUID(),
      creatorProfileId: activeProfile.id,
      name: localVariation.name,
      description: input.description,
      difficulty: localVariation.difficulty,
      baseSpeed: localVariation.baseSpeed,
      gridSize: localVariation.gridSize,
      maxConcurrentFoods: localVariation.maxConcurrentFoods,
      snakeHeadImage: localVariation.snakeHeadImage,
      powerupTypes: localVariation.powerupTypes,
      customColors: localVariation.customColors,
      favoriteCount: 0,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    sharedVariations.push(sharedVariation);
    localStorage.setItem(SHARED_VARIATIONS_KEY, JSON.stringify(sharedVariations));

    return {
      sharedId: sharedVariation.id,
      message: `Variation "${localVariation.name}" shared to hub successfully`
    };
  },

  async unshareTheme(sharedId: string): Promise<UnshareResponse> {
    const activeProfile = getActiveProfile();
    if (!activeProfile) {
      throw new Error("No active profile");
    }

    const data = localStorage.getItem(SHARED_THEMES_KEY);
    const sharedThemes: SharedTheme[] = data ? JSON.parse(data) : [];
    const theme = sharedThemes.find((t) => t.id === sharedId);

    if (!theme) {
      throw new Error("Shared theme not found");
    }

    if (theme.creatorProfileId !== activeProfile.id) {
      throw new Error("Only the creator can unshare this theme");
    }

    const filtered = sharedThemes.filter((t) => t.id !== sharedId);
    localStorage.setItem(SHARED_THEMES_KEY, JSON.stringify(filtered));

    return {
      success: true,
      message: "Theme unshared successfully"
    };
  },

  async unshareVariation(sharedId: string): Promise<UnshareResponse> {
    const activeProfile = getActiveProfile();
    if (!activeProfile) {
      throw new Error("No active profile");
    }

    const data = localStorage.getItem(SHARED_VARIATIONS_KEY);
    const sharedVariations: SharedVariation[] = data ? JSON.parse(data) : [];
    const variation = sharedVariations.find((v) => v.id === sharedId);

    if (!variation) {
      throw new Error("Shared variation not found");
    }

    if (variation.creatorProfileId !== activeProfile.id) {
      throw new Error("Only the creator can unshare this variation");
    }

    const filtered = sharedVariations.filter((v) => v.id !== sharedId);
    localStorage.setItem(SHARED_VARIATIONS_KEY, JSON.stringify(filtered));

    return {
      success: true,
      message: "Variation unshared successfully"
    };
  },

  // ============ FAVORITES (AUTH REQUIRED) ============

  async favoriteTheme(sharedId: string): Promise<FavoriteResponse> {
    const favoritesData = localStorage.getItem(THEME_FAVORITES_KEY);
    const favorites: string[] = favoritesData ? JSON.parse(favoritesData) : [];

    if (!favorites.includes(sharedId)) {
      favorites.push(sharedId);
      localStorage.setItem(THEME_FAVORITES_KEY, JSON.stringify(favorites));

      // Increment favorite count
      const data = localStorage.getItem(SHARED_THEMES_KEY);
      const sharedThemes: SharedTheme[] = data ? JSON.parse(data) : [];
      const theme = sharedThemes.find((t) => t.id === sharedId);
      if (theme) {
        theme.favoriteCount++;
        localStorage.setItem(SHARED_THEMES_KEY, JSON.stringify(sharedThemes));
      }
    }

    const data = localStorage.getItem(SHARED_THEMES_KEY);
    const sharedThemes: SharedTheme[] = data ? JSON.parse(data) : [];
    const theme = sharedThemes.find((t) => t.id === sharedId);

    return {
      success: true,
      favoriteCount: theme?.favoriteCount ?? 0
    };
  },

  async unfavoriteTheme(sharedId: string): Promise<FavoriteResponse> {
    const favoritesData = localStorage.getItem(THEME_FAVORITES_KEY);
    const favorites: string[] = favoritesData ? JSON.parse(favoritesData) : [];

    const filtered = favorites.filter((id) => id !== sharedId);
    localStorage.setItem(THEME_FAVORITES_KEY, JSON.stringify(filtered));

    // Decrement favorite count
    const data = localStorage.getItem(SHARED_THEMES_KEY);
    const sharedThemes: SharedTheme[] = data ? JSON.parse(data) : [];
    const theme = sharedThemes.find((t) => t.id === sharedId);
    if (theme && theme.favoriteCount > 0) {
      theme.favoriteCount--;
      localStorage.setItem(SHARED_THEMES_KEY, JSON.stringify(sharedThemes));
    }

    return {
      success: true,
      favoriteCount: theme?.favoriteCount ?? 0
    };
  },

  async favoriteVariation(sharedId: string): Promise<FavoriteResponse> {
    const favoritesData = localStorage.getItem(VARIATION_FAVORITES_KEY);
    const favorites: string[] = favoritesData ? JSON.parse(favoritesData) : [];

    if (!favorites.includes(sharedId)) {
      favorites.push(sharedId);
      localStorage.setItem(VARIATION_FAVORITES_KEY, JSON.stringify(favorites));

      // Increment favorite count
      const data = localStorage.getItem(SHARED_VARIATIONS_KEY);
      const sharedVariations: SharedVariation[] = data ? JSON.parse(data) : [];
      const variation = sharedVariations.find((v) => v.id === sharedId);
      if (variation) {
        variation.favoriteCount++;
        localStorage.setItem(SHARED_VARIATIONS_KEY, JSON.stringify(sharedVariations));
      }
    }

    const data = localStorage.getItem(SHARED_VARIATIONS_KEY);
    const sharedVariations: SharedVariation[] = data ? JSON.parse(data) : [];
    const variation = sharedVariations.find((v) => v.id === sharedId);

    return {
      success: true,
      favoriteCount: variation?.favoriteCount ?? 0
    };
  },

  async unfavoriteVariation(sharedId: string): Promise<FavoriteResponse> {
    const favoritesData = localStorage.getItem(VARIATION_FAVORITES_KEY);
    const favorites: string[] = favoritesData ? JSON.parse(favoritesData) : [];

    const filtered = favorites.filter((id) => id !== sharedId);
    localStorage.setItem(VARIATION_FAVORITES_KEY, JSON.stringify(filtered));

    // Decrement favorite count
    const data = localStorage.getItem(SHARED_VARIATIONS_KEY);
    const sharedVariations: SharedVariation[] = data ? JSON.parse(data) : [];
    const variation = sharedVariations.find((v) => v.id === sharedId);
    if (variation && variation.favoriteCount > 0) {
      variation.favoriteCount--;
      localStorage.setItem(SHARED_VARIATIONS_KEY, JSON.stringify(sharedVariations));
    }

    return {
      success: true,
      favoriteCount: variation?.favoriteCount ?? 0
    };
  },

  async getUserFavorites(): Promise<UserFavorites> {
    const themeFavoritesData = localStorage.getItem(THEME_FAVORITES_KEY);
    const variationFavoritesData = localStorage.getItem(VARIATION_FAVORITES_KEY);

    return {
      themes: themeFavoritesData ? JSON.parse(themeFavoritesData) : [],
      variations: variationFavoritesData ? JSON.parse(variationFavoritesData) : []
    };
  },

  // ============ COPY TO LOCAL (AUTH REQUIRED) ============

  async copyThemeToLocal(sharedId: string, customName?: string): Promise<CopyThemeResponse> {
    const activeProfile = getActiveProfile();
    if (!activeProfile) {
      throw new Error("No active profile");
    }

    const sharedData = localStorage.getItem(SHARED_THEMES_KEY);
    const sharedThemes: SharedTheme[] = sharedData ? JSON.parse(sharedData) : [];
    const sharedTheme = sharedThemes.find((t) => t.id === sharedId);

    if (!sharedTheme) {
      throw new Error("Shared theme not found");
    }

    // Get local themes
    const localData = localStorage.getItem("snake_themes");
    const localThemes = localData ? JSON.parse(localData) : [];

    // Create local copy
    const newTheme = {
      id: crypto.randomUUID(),
      userId: "user",
      name: customName || `${sharedTheme.name} (Copy)`,
      fontFamily: sharedTheme.fontFamily,
      colors: sharedTheme.colors,
      iconColors: sharedTheme.iconColors,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: false
    };

    localThemes.push(newTheme);
    localStorage.setItem("snake_themes", JSON.stringify(localThemes));

    // Increment usage count
    sharedTheme.usageCount++;
    localStorage.setItem(SHARED_THEMES_KEY, JSON.stringify(sharedThemes));

    return {
      themeId: newTheme.id,
      message: `Theme copied to your local themes as "${newTheme.name}"`
    };
  },

  async copyVariationToLocal(sharedId: string, customName?: string): Promise<CopyVariationResponse> {
    const activeProfile = getActiveProfile();
    if (!activeProfile) {
      throw new Error("No active profile");
    }

    const sharedData = localStorage.getItem(SHARED_VARIATIONS_KEY);
    const sharedVariations: SharedVariation[] = sharedData ? JSON.parse(sharedData) : [];
    const sharedVariation = sharedVariations.find((v) => v.id === sharedId);

    if (!sharedVariation) {
      throw new Error("Shared variation not found");
    }

    // Get local variations
    const localData = localStorage.getItem("snake_game_variations");
    const localVariations = localData ? JSON.parse(localData) : [];

    // Create local copy
    const newVariation = {
      id: crypto.randomUUID(),
      profileId: activeProfile.id,
      name: customName || `${sharedVariation.name} (Copy)`,
      description: sharedVariation.description,
      difficulty: sharedVariation.difficulty,
      baseSpeed: sharedVariation.baseSpeed,
      gridSize: sharedVariation.gridSize,
      maxConcurrentFoods: sharedVariation.maxConcurrentFoods,
      snakeHeadImage: sharedVariation.snakeHeadImage,
      powerupTypes: sharedVariation.powerupTypes,
      customColors: sharedVariation.customColors,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    localVariations.push(newVariation);
    localStorage.setItem("snake_game_variations", JSON.stringify(localVariations));

    // Increment usage count
    sharedVariation.usageCount++;
    localStorage.setItem(SHARED_VARIATIONS_KEY, JSON.stringify(sharedVariations));

    return {
      variationId: newVariation.id,
      message: `Variation copied to your local variations as "${newVariation.name}"`
    };
  }
};