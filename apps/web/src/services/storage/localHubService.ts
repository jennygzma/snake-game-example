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
  GameVariation,
  HubThemeWithCreator,
  HubVariationWithCreator
} from "@snake/contracts";
import type { HubService } from "../hubService";

// Local storage keys
const SHARED_THEMES_KEY = "snake_shared_themes";
const SHARED_VARIATIONS_KEY = "snake_shared_variations";
const FAVORITES_KEY = "snake_favorites";
const THEMES_KEY = "snake.themes";
const PROFILES_KEY = "snake.profiles";

interface LocalSharedTheme extends HubThemeWithCreator {
  originalThemeId: string;
}

interface LocalSharedVariation extends HubVariationWithCreator {
  originalVariationId: string;
}

interface LocalFavorites {
  themeIds: string[];
  variationIds: string[];
}

/**
 * Local storage implementation of HubService for offline/demo mode
 */
export const localHubService: HubService = {
  async browseThemes(params: HubSearchParams): Promise<HubThemesResponse> {
    const stored = localStorage.getItem(SHARED_THEMES_KEY);
    const themes: LocalSharedTheme[] = stored ? JSON.parse(stored) : [];
    
    let filtered = [...themes];
    
    // Apply query filter
    if (params.query) {
      const query = params.query.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    if (params.sortBy === "popular") {
      filtered.sort((a, b) => b.usageCount - a.usageCount);
    } else if (params.sortBy === "favorites") {
      filtered.sort((a, b) => b.favoriteCount - a.favoriteCount);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    // Apply pagination
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const start = (page - 1) * limit;
    const paginatedThemes = filtered.slice(start, start + limit);
    
    return {
      themes: paginatedThemes,
      total: filtered.length,
      page,
      limit,
      hasMore: start + limit < filtered.length
    };
  },

  async browseVariations(params: HubSearchParams): Promise<HubVariationsResponse> {
    const stored = localStorage.getItem(SHARED_VARIATIONS_KEY);
    const variations: LocalSharedVariation[] = stored ? JSON.parse(stored) : [];
    
    let filtered = [...variations];
    
    // Apply query filter
    if (params.query) {
      const query = params.query.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.description?.toLowerCase().includes(query)
      );
    }
    
    // Apply difficulty filter
    if (params.difficulty) {
      filtered = filtered.filter((v) => v.difficulty === params.difficulty);
    }
    
    // Apply sorting
    if (params.sortBy === "popular") {
      filtered.sort((a, b) => b.usageCount - a.usageCount);
    } else if (params.sortBy === "favorites") {
      filtered.sort((a, b) => b.favoriteCount - a.favoriteCount);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    // Apply pagination
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const start = (page - 1) * limit;
    const paginatedVariations = filtered.slice(start, start + limit);
    
    return {
      variations: paginatedVariations,
      total: filtered.length,
      page,
      limit,
      hasMore: start + limit < filtered.length
    };
  },

  async shareTheme(input: ShareThemeInput): Promise<ShareResponse> {
    // Get local themes
    const themesStored = localStorage.getItem(THEMES_KEY);
    const themes: CustomTheme[] = themesStored ? JSON.parse(themesStored) : [];
    const theme = themes.find((t) => t.id === input.themeId);
    
    if (!theme) {
      throw new Error("Theme not found");
    }
    
    // Get active profile from profiles collection
    const profileStored = localStorage.getItem(PROFILES_KEY);
    const profiles: Array<{ id: string; name: string; avatarBase64?: string | null; isActive?: boolean }> =
      profileStored ? JSON.parse(profileStored) : [];
    const activeProfile = profiles.find((profile) => profile.isActive);
    
    if (!activeProfile) {
      throw new Error("No active profile");
    }
    
    // Create shared theme
    const sharedId = crypto.randomUUID();
    const shared: LocalSharedTheme = {
      id: sharedId,
      creatorProfileId: activeProfile.id,
      name: theme.name,
      description: input.description,
      fontFamily: theme.fontFamily,
      colors: theme.colors,
      iconColors: theme.iconColors,
      favoriteCount: 0,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creator: {
        profileId: activeProfile.id,
        profileName: activeProfile.name,
        profileAvatar: activeProfile.avatarBase64 || undefined
      },
      isFavorited: false,
      originalThemeId: input.themeId
    };
    
    // Store shared theme
    const stored = localStorage.getItem(SHARED_THEMES_KEY);
    const sharedThemes: LocalSharedTheme[] = stored ? JSON.parse(stored) : [];
    sharedThemes.push(shared);
    localStorage.setItem(SHARED_THEMES_KEY, JSON.stringify(sharedThemes));
    
    return {
      sharedId,
      message: "Theme shared successfully"
    };
  },

  async shareVariation(input: ShareVariationInput): Promise<ShareResponse> {
    // Similar implementation for variations
    const variationsStored = localStorage.getItem("snake_game_variations");
    const variations: GameVariation[] = variationsStored ? JSON.parse(variationsStored) : [];
    const variation = variations.find((v) => v.id === input.variationId);
    
    if (!variation) {
      throw new Error("Variation not found");
    }
    
    const profileStored = localStorage.getItem(PROFILES_KEY);
    const profiles: Array<{ id: string; name: string; avatarBase64?: string | null; isActive?: boolean }> =
      profileStored ? JSON.parse(profileStored) : [];
    const activeProfile = profiles.find((profile) => profile.isActive);
    
    if (!activeProfile) {
      throw new Error("No active profile");
    }
    
    const sharedId = crypto.randomUUID();
    const shared: LocalSharedVariation = {
      id: sharedId,
      creatorProfileId: activeProfile.id,
      name: variation.name,
      description: input.description ?? variation.description,
      difficulty: variation.difficulty,
      baseSpeed: variation.baseSpeed,
      gridSize: variation.gridSize,
      maxConcurrentFoods: variation.maxConcurrentFoods,
      snakeHeadImage: variation.snakeHeadImage,
      powerupTypes: variation.powerupTypes,
      customColors: variation.customColors,
      favoriteCount: 0,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creator: {
        profileId: activeProfile.id,
        profileName: activeProfile.name,
        profileAvatar: activeProfile.avatarBase64 || undefined
      },
      isFavorited: false,
      originalVariationId: input.variationId
    };
    
    const stored = localStorage.getItem(SHARED_VARIATIONS_KEY);
    const sharedVariations: LocalSharedVariation[] = stored ? JSON.parse(stored) : [];
    sharedVariations.push(shared);
    localStorage.setItem(SHARED_VARIATIONS_KEY, JSON.stringify(sharedVariations));
    
    return {
      sharedId,
      message: "Variation shared successfully"
    };
  },

  async unshareTheme(sharedId: string): Promise<void> {
    const stored = localStorage.getItem(SHARED_THEMES_KEY);
    const themes: LocalSharedTheme[] = stored ? JSON.parse(stored) : [];
    const filtered = themes.filter((t) => t.id !== sharedId);
    localStorage.setItem(SHARED_THEMES_KEY, JSON.stringify(filtered));
  },

  async unshareVariation(sharedId: string): Promise<void> {
    const stored = localStorage.getItem(SHARED_VARIATIONS_KEY);
    const variations: LocalSharedVariation[] = stored ? JSON.parse(stored) : [];
    const filtered = variations.filter((v) => v.id !== sharedId);
    localStorage.setItem(SHARED_VARIATIONS_KEY, JSON.stringify(filtered));
  },

  async favoriteTheme(sharedId: string): Promise<void> {
    const favStored = localStorage.getItem(FAVORITES_KEY);
    const favorites: LocalFavorites = favStored
      ? JSON.parse(favStored)
      : { themeIds: [], variationIds: [] };
    
    if (!favorites.themeIds.includes(sharedId)) {
      favorites.themeIds.push(sharedId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      
      // Increment favorite count
      const stored = localStorage.getItem(SHARED_THEMES_KEY);
      const themes: LocalSharedTheme[] = stored ? JSON.parse(stored) : [];
      const theme = themes.find((t) => t.id === sharedId);
      if (theme) {
        theme.favoriteCount++;
        localStorage.setItem(SHARED_THEMES_KEY, JSON.stringify(themes));
      }
    }
  },

  async unfavoriteTheme(sharedId: string): Promise<void> {
    const favStored = localStorage.getItem(FAVORITES_KEY);
    const favorites: LocalFavorites = favStored
      ? JSON.parse(favStored)
      : { themeIds: [], variationIds: [] };
    
    favorites.themeIds = favorites.themeIds.filter((id) => id !== sharedId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    
    // Decrement favorite count
    const stored = localStorage.getItem(SHARED_THEMES_KEY);
    const themes: LocalSharedTheme[] = stored ? JSON.parse(stored) : [];
    const theme = themes.find((t) => t.id === sharedId);
    if (theme && theme.favoriteCount > 0) {
      theme.favoriteCount--;
      localStorage.setItem(SHARED_THEMES_KEY, JSON.stringify(themes));
    }
  },

  async favoriteVariation(sharedId: string): Promise<void> {
    const favStored = localStorage.getItem(FAVORITES_KEY);
    const favorites: LocalFavorites = favStored
      ? JSON.parse(favStored)
      : { themeIds: [], variationIds: [] };
    
    if (!favorites.variationIds.includes(sharedId)) {
      favorites.variationIds.push(sharedId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      
      const stored = localStorage.getItem(SHARED_VARIATIONS_KEY);
      const variations: LocalSharedVariation[] = stored ? JSON.parse(stored) : [];
      const variation = variations.find((v) => v.id === sharedId);
      if (variation) {
        variation.favoriteCount++;
        localStorage.setItem(SHARED_VARIATIONS_KEY, JSON.stringify(variations));
      }
    }
  },

  async unfavoriteVariation(sharedId: string): Promise<void> {
    const favStored = localStorage.getItem(FAVORITES_KEY);
    const favorites: LocalFavorites = favStored
      ? JSON.parse(favStored)
      : { themeIds: [], variationIds: [] };
    
    favorites.variationIds = favorites.variationIds.filter((id) => id !== sharedId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    
    const stored = localStorage.getItem(SHARED_VARIATIONS_KEY);
    const variations: LocalSharedVariation[] = stored ? JSON.parse(stored) : [];
    const variation = variations.find((v) => v.id === sharedId);
    if (variation && variation.favoriteCount > 0) {
      variation.favoriteCount--;
      localStorage.setItem(SHARED_VARIATIONS_KEY, JSON.stringify(variations));
    }
  },

  async getUserFavorites(): Promise<FavoritesResponse> {
    const favStored = localStorage.getItem(FAVORITES_KEY);
    const favorites: LocalFavorites = favStored
      ? JSON.parse(favStored)
      : { themeIds: [], variationIds: [] };
    
    const themesStored = localStorage.getItem(SHARED_THEMES_KEY);
    const themes: LocalSharedTheme[] = themesStored ? JSON.parse(themesStored) : [];
    const favoritedThemes = themes.filter((t) => favorites.themeIds.includes(t.id));
    
    const variationsStored = localStorage.getItem(SHARED_VARIATIONS_KEY);
    const variations: LocalSharedVariation[] = variationsStored ? JSON.parse(variationsStored) : [];
    const favoritedVariations = variations.filter((v) => favorites.variationIds.includes(v.id));
    
    return {
      themes: favoritedThemes,
      variations: favoritedVariations
    };
  },

  async copyThemeToLocal(sharedId: string, customName?: string): Promise<CustomTheme> {
    const stored = localStorage.getItem(SHARED_THEMES_KEY);
    const themes: LocalSharedTheme[] = stored ? JSON.parse(stored) : [];
    const shared = themes.find((t) => t.id === sharedId);
    
    if (!shared) {
      throw new Error("Shared theme not found");
    }
    
    // Increment usage count
    shared.usageCount++;
    localStorage.setItem(SHARED_THEMES_KEY, JSON.stringify(themes));
    
    // Create local copy
    const localId = crypto.randomUUID();
    const localTheme: CustomTheme = {
      id: localId,
      userId: "user",
      name: customName || `${shared.name} (Copy)`,
      fontFamily: shared.fontFamily,
      colors: shared.colors,
      iconColors: shared.iconColors,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: false
    };
    
    const localStored = localStorage.getItem(THEMES_KEY);
    const localThemes: CustomTheme[] = localStored ? JSON.parse(localStored) : [];
    localThemes.push(localTheme);
    localStorage.setItem(THEMES_KEY, JSON.stringify(localThemes));
    
    return localTheme;
  },

  async copyVariationToLocal(sharedId: string, customName?: string): Promise<GameVariation> {
    const stored = localStorage.getItem(SHARED_VARIATIONS_KEY);
    const variations: LocalSharedVariation[] = stored ? JSON.parse(stored) : [];
    const shared = variations.find((v) => v.id === sharedId);
    
    if (!shared) {
      throw new Error("Shared variation not found");
    }
    
    // Increment usage count
    shared.usageCount++;
    localStorage.setItem(SHARED_VARIATIONS_KEY, JSON.stringify(variations));
    
    // Create local copy
    const localId = crypto.randomUUID();
    const profileStored = localStorage.getItem(PROFILES_KEY);
    const profiles: Array<{ id: string; isActive?: boolean }> = profileStored ? JSON.parse(profileStored) : [];
    const activeProfile = profiles.find((profile) => profile.isActive) || { id: "user" };
    
    const localVariation: GameVariation = {
      id: localId,
      profileId: activeProfile.id,
      name: customName || `${shared.name} (Copy)`,
      description: shared.description,
      difficulty: shared.difficulty,
      baseSpeed: shared.baseSpeed,
      gridSize: shared.gridSize,
      maxConcurrentFoods: shared.maxConcurrentFoods,
      snakeHeadImage: shared.snakeHeadImage,
      powerupTypes: shared.powerupTypes,
      customColors: shared.customColors,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const localStored = localStorage.getItem("snake_game_variations");
    const localVariations: GameVariation[] = localStored ? JSON.parse(localStored) : [];
    localVariations.push(localVariation);
    localStorage.setItem("snake_game_variations", JSON.stringify(localVariations));
    
    return localVariation;
  }
};
