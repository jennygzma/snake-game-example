import {
  hubSearchParamsSchema,
  shareThemeInputSchema,
  shareVariationInputSchema,
  profileSchema,
  type HubSearchParams,
  type HubThemesResponse,
  type HubVariationsResponse,
  type SharedThemeResponse,
  type SharedVariationResponse,
  type ShareThemeInput,
  type ShareVariationInput,
  type ShareResponse,
  type UnshareResponse,
  type FavoriteResponse,
  type UnfavoriteResponse,
  type UserFavoritesResponse,
  type SharedThemeWithCreator,
  type SharedVariationWithCreator,
  type CustomTheme,
  type GameVariation
} from "@snake/contracts";
import type { HubService } from "../hubService";

const SHARED_THEMES_KEY = "snake.hub.shared_themes";
const SHARED_VARIATIONS_KEY = "snake.hub.shared_variations";
const THEME_FAVORITES_KEY = "snake.hub.theme_favorites";
const VARIATION_FAVORITES_KEY = "snake.hub.variation_favorites";
const THEMES_KEY = "snake.themes";
const VARIATIONS_KEY = "snake_game_variations";
const PROFILES_KEY = "snake.profiles";

const getActiveProfileId = (): string => {
  const raw = localStorage.getItem(PROFILES_KEY);
  if (!raw) throw new Error("No active profile found");

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("No active profile found");
    const active = parsed
      .map((value) => profileSchema.safeParse(value))
      .filter((result): result is { success: true; data: ReturnType<typeof profileSchema.parse> } => result.success)
      .map((result) => result.data)
      .find((profile) => profile.isActive);
    if (!active) throw new Error("No active profile found");
    return active.id;
  } catch {
    throw new Error("No active profile found");
  }
};

const getActiveProfile = () => {
  const raw = localStorage.getItem(PROFILES_KEY);
  if (!raw) throw new Error("No active profile found");

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("No active profile found");
    const active = parsed
      .map((value) => profileSchema.safeParse(value))
      .filter((result): result is { success: true; data: ReturnType<typeof profileSchema.parse> } => result.success)
      .map((result) => result.data)
      .find((profile) => profile.isActive);
    if (!active) throw new Error("No active profile found");
    return active;
  } catch {
    throw new Error("No active profile found");
  }
};

const readSharedThemes = (): SharedThemeWithCreator[] => {
  const raw = localStorage.getItem(SHARED_THEMES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeSharedThemes = (themes: SharedThemeWithCreator[]): void => {
  localStorage.setItem(SHARED_THEMES_KEY, JSON.stringify(themes));
};

const readSharedVariations = (): SharedVariationWithCreator[] => {
  const raw = localStorage.getItem(SHARED_VARIATIONS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeSharedVariations = (variations: SharedVariationWithCreator[]): void => {
  localStorage.setItem(SHARED_VARIATIONS_KEY, JSON.stringify(variations));
};

const readThemeFavorites = (): Record<string, string[]> => {
  const raw = localStorage.getItem(THEME_FAVORITES_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeThemeFavorites = (favorites: Record<string, string[]>): void => {
  localStorage.setItem(THEME_FAVORITES_KEY, JSON.stringify(favorites));
};

const readVariationFavorites = (): Record<string, string[]> => {
  const raw = localStorage.getItem(VARIATION_FAVORITES_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeVariationFavorites = (favorites: Record<string, string[]>): void => {
  localStorage.setItem(VARIATION_FAVORITES_KEY, JSON.stringify(favorites));
};

const readLocalThemes = (): CustomTheme[] => {
  const raw = localStorage.getItem(THEMES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalThemes = (themes: CustomTheme[]): void => {
  localStorage.setItem(THEMES_KEY, JSON.stringify(themes));
};

const readLocalVariations = (): GameVariation[] => {
  const raw = localStorage.getItem(VARIATIONS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalVariations = (variations: GameVariation[]): void => {
  localStorage.setItem(VARIATIONS_KEY, JSON.stringify(variations));
};

export const localHubService: HubService = {
  async browseThemes(params: HubSearchParams): Promise<HubThemesResponse> {
    const validated = hubSearchParamsSchema.parse(params);
    let themes = readSharedThemes();

    // Filter by query
    if (validated.query) {
      const query = validated.query.toLowerCase();
      themes = themes.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query))
      );
    }

    // Sort
    if (validated.sortBy === "popular") {
      themes.sort((a, b) => b.usageCount - a.usageCount);
    } else if (validated.sortBy === "favorites") {
      themes.sort((a, b) => b.favoriteCount - a.favoriteCount);
    } else {
      themes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Paginate
    const page = validated.page || 1;
    const limit = validated.limit || 20;
    const start = (page - 1) * limit;
    const paginatedThemes = themes.slice(start, start + limit);

    return {
      themes: paginatedThemes,
      pagination: {
        total: themes.length,
        page,
        limit,
        totalPages: Math.ceil(themes.length / limit)
      }
    };
  },

  async browseVariations(params: HubSearchParams): Promise<HubVariationsResponse> {
    const validated = hubSearchParamsSchema.parse(params);
    let variations = readSharedVariations();

    // Filter by query
    if (validated.query) {
      const query = validated.query.toLowerCase();
      variations = variations.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          (v.description && v.description.toLowerCase().includes(query))
      );
    }

    // Filter by difficulty
    if (validated.difficulty) {
      variations = variations.filter((v) => v.difficulty === validated.difficulty);
    }

    // Sort
    if (validated.sortBy === "popular") {
      variations.sort((a, b) => b.usageCount - a.usageCount);
    } else if (validated.sortBy === "favorites") {
      variations.sort((a, b) => b.favoriteCount - a.favoriteCount);
    } else {
      variations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Paginate
    const page = validated.page || 1;
    const limit = validated.limit || 20;
    const start = (page - 1) * limit;
    const paginatedVariations = variations.slice(start, start + limit);

    return {
      variations: paginatedVariations,
      pagination: {
        total: variations.length,
        page,
        limit,
        totalPages: Math.ceil(variations.length / limit)
      }
    };
  },

  async getSharedTheme(id: string): Promise<SharedThemeResponse | null> {
    const themes = readSharedThemes();
    const theme = themes.find((t) => t.id === id);
    return theme ? { theme } : null;
  },

  async getSharedVariation(id: string): Promise<SharedVariationResponse | null> {
    const variations = readSharedVariations();
    const variation = variations.find((v) => v.id === id);
    return variation ? { variation } : null;
  },

  async shareTheme(input: ShareThemeInput): Promise<ShareResponse> {
    const validated = shareThemeInputSchema.parse(input);
    const activeProfile = getActiveProfile();
    const localThemes = readLocalThemes();
    const sourceTheme = localThemes.find((t) => t.id === validated.themeId && t.userId === activeProfile.id);

    if (!sourceTheme) {
      throw new Error("Theme not found");
    }

    const now = new Date().toISOString();
    const sharedTheme: SharedThemeWithCreator = {
      id: crypto.randomUUID(),
      creatorProfileId: activeProfile.id,
      name: sourceTheme.name,
      description: validated.description,
      fontFamily: sourceTheme.fontFamily,
      colors: sourceTheme.colors,
      iconColors: sourceTheme.iconColors,
      favoriteCount: 0,
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
      creator: {
        id: activeProfile.id,
        name: activeProfile.name,
        avatarBase64: activeProfile.avatarBase64 || undefined
      }
    };

    const sharedThemes = readSharedThemes();
    writeSharedThemes([...sharedThemes, sharedTheme]);

    return {
      sharedId: sharedTheme.id,
      message: `Theme "${sharedTheme.name}" shared to hub successfully`
    };
  },

  async shareVariation(input: ShareVariationInput): Promise<ShareResponse> {
    const validated = shareVariationInputSchema.parse(input);
    const activeProfile = getActiveProfile();
    const localVariations = readLocalVariations();
    const sourceVariation = localVariations.find(
      (v) => v.id === validated.variationId && v.profileId === activeProfile.id
    );

    if (!sourceVariation) {
      throw new Error("Variation not found");
    }

    const now = new Date().toISOString();
    const sharedVariation: SharedVariationWithCreator = {
      id: crypto.randomUUID(),
      creatorProfileId: activeProfile.id,
      name: sourceVariation.name,
      description: validated.description || sourceVariation.description,
      difficulty: sourceVariation.difficulty,
      baseSpeed: sourceVariation.baseSpeed,
      gridSize: sourceVariation.gridSize,
      maxConcurrentFoods: sourceVariation.maxConcurrentFoods,
      snakeHeadImage: sourceVariation.snakeHeadImage,
      powerupTypes: sourceVariation.powerupTypes,
      customColors: sourceVariation.customColors,
      favoriteCount: 0,
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
      creator: {
        id: activeProfile.id,
        name: activeProfile.name,
        avatarBase64: activeProfile.avatarBase64 || undefined
      }
    };

    const sharedVariations = readSharedVariations();
    writeSharedVariations([...sharedVariations, sharedVariation]);

    return {
      sharedId: sharedVariation.id,
      message: `Variation "${sharedVariation.name}" shared to hub successfully`
    };
  },

  async updateSharedTheme(id: string, description: string): Promise<UnshareResponse> {
    const activeProfileId = getActiveProfileId();
    const themes = readSharedThemes();
    const themeIndex = themes.findIndex((t) => t.id === id && t.creatorProfileId === activeProfileId);

    if (themeIndex === -1 || !themes[themeIndex]) {
      throw new Error("Shared theme not found or not creator");
    }

    themes[themeIndex].description = description;
    themes[themeIndex].updatedAt = new Date().toISOString();
    writeSharedThemes(themes);

    return { message: "Shared theme updated successfully" };
  },

  async updateSharedVariation(id: string, description: string): Promise<UnshareResponse> {
    const activeProfileId = getActiveProfileId();
    const variations = readSharedVariations();
    const variationIndex = variations.findIndex(
      (v) => v.id === id && v.creatorProfileId === activeProfileId
    );

    if (variationIndex === -1 || !variations[variationIndex]) {
      throw new Error("Shared variation not found or not creator");
    }

    variations[variationIndex].description = description;
    variations[variationIndex].updatedAt = new Date().toISOString();
    writeSharedVariations(variations);

    return { message: "Shared variation updated successfully" };
  },

  async unshareTheme(id: string): Promise<UnshareResponse> {
    const activeProfileId = getActiveProfileId();
    const themes = readSharedThemes();
    const filtered = themes.filter((t) => !(t.id === id && t.creatorProfileId === activeProfileId));

    if (filtered.length === themes.length) {
      throw new Error("Shared theme not found or not creator");
    }

    writeSharedThemes(filtered);
    return { message: "Theme unshared from hub successfully" };
  },

  async unshareVariation(id: string): Promise<UnshareResponse> {
    const activeProfileId = getActiveProfileId();
    const variations = readSharedVariations();
    const filtered = variations.filter(
      (v) => !(v.id === id && v.creatorProfileId === activeProfileId)
    );

    if (filtered.length === variations.length) {
      throw new Error("Shared variation not found or not creator");
    }

    writeSharedVariations(filtered);
    return { message: "Variation unshared from hub successfully" };
  },

  async favoriteTheme(sharedThemeId: string): Promise<FavoriteResponse> {
    const activeProfileId = getActiveProfileId();
    const favorites = readThemeFavorites();
    const userFavorites = favorites[activeProfileId] || [];

    if (userFavorites.includes(sharedThemeId)) {
      throw new Error("Theme already favorited");
    }

    favorites[activeProfileId] = [...userFavorites, sharedThemeId];
    writeThemeFavorites(favorites);

    // Update favorite count
    const themes = readSharedThemes();
    const themeIndex = themes.findIndex((t) => t.id === sharedThemeId);
    if (themeIndex !== -1 && themes[themeIndex]) {
      themes[themeIndex]!.favoriteCount++;
      writeSharedThemes(themes);
      return {
        message: "Theme added to favorites",
        favoriteCount: themes[themeIndex]!.favoriteCount
      };
    }

    return {
      message: "Theme added to favorites",
      favoriteCount: 0
    };
  },

  async unfavoriteTheme(sharedThemeId: string): Promise<UnfavoriteResponse> {
    const activeProfileId = getActiveProfileId();
    const favorites = readThemeFavorites();
    const userFavorites = favorites[activeProfileId] || [];

    if (!userFavorites.includes(sharedThemeId)) {
      throw new Error("Theme not favorited");
    }

    favorites[activeProfileId] = userFavorites.filter((id) => id !== sharedThemeId);
    writeThemeFavorites(favorites);

    // Update favorite count
    const themes = readSharedThemes();
    const themeIndex = themes.findIndex((t) => t.id === sharedThemeId);
    if (themeIndex !== -1 && themes[themeIndex] && themes[themeIndex]!.favoriteCount > 0) {
      themes[themeIndex]!.favoriteCount--;
      writeSharedThemes(themes);
      return {
        message: "Theme removed from favorites",
        favoriteCount: themes[themeIndex]!.favoriteCount
      };
    }

    return {
      message: "Theme removed from favorites",
      favoriteCount: 0
    };
  },

  async favoriteVariation(sharedVariationId: string): Promise<FavoriteResponse> {
    const activeProfileId = getActiveProfileId();
    const favorites = readVariationFavorites();
    const userFavorites = favorites[activeProfileId] || [];

    if (userFavorites.includes(sharedVariationId)) {
      throw new Error("Variation already favorited");
    }

    favorites[activeProfileId] = [...userFavorites, sharedVariationId];
    writeVariationFavorites(favorites);

    // Update favorite count
    const variations = readSharedVariations();
    const variationIndex = variations.findIndex((v) => v.id === sharedVariationId);
    if (variationIndex !== -1 && variations[variationIndex]) {
      variations[variationIndex]!.favoriteCount++;
      writeSharedVariations(variations);
      return {
        message: "Variation added to favorites",
        favoriteCount: variations[variationIndex]!.favoriteCount
      };
    }

    return {
      message: "Variation added to favorites",
      favoriteCount: 0
    };
  },

  async unfavoriteVariation(sharedVariationId: string): Promise<UnfavoriteResponse> {
    const activeProfileId = getActiveProfileId();
    const favorites = readVariationFavorites();
    const userFavorites = favorites[activeProfileId] || [];

    if (!userFavorites.includes(sharedVariationId)) {
      throw new Error("Variation not favorited");
    }

    favorites[activeProfileId] = userFavorites.filter((id) => id !== sharedVariationId);
    writeVariationFavorites(favorites);

    // Update favorite count
    const variations = readSharedVariations();
    const variationIndex = variations.findIndex((v) => v.id === sharedVariationId);
    if (variationIndex !== -1 && variations[variationIndex] && variations[variationIndex]!.favoriteCount > 0) {
      variations[variationIndex]!.favoriteCount--;
      writeSharedVariations(variations);
      return {
        message: "Variation removed from favorites",
        favoriteCount: variations[variationIndex]!.favoriteCount
      };
    }

    return {
      message: "Variation removed from favorites",
      favoriteCount: 0
    };
  },

  async getUserFavorites(): Promise<UserFavoritesResponse> {
    const activeProfileId = getActiveProfileId();
    const themeFavorites = readThemeFavorites();
    const variationFavorites = readVariationFavorites();
    const userThemeFavorites = themeFavorites[activeProfileId] || [];
    const userVariationFavorites = variationFavorites[activeProfileId] || [];

    const allThemes = readSharedThemes();
    const allVariations = readSharedVariations();

    const themes = allThemes.filter((t) => userThemeFavorites.includes(t.id));
    const variations = allVariations.filter((v) => userVariationFavorites.includes(v.id));

    return { themes, variations };
  },

  async copyThemeToLocal(sharedThemeId: string, customName?: string): Promise<CustomTheme> {
    const sharedTheme = readSharedThemes().find((t) => t.id === sharedThemeId);
    if (!sharedTheme) {
      throw new Error("Shared theme not found");
    }

    const activeProfileId = getActiveProfileId();
    const now = new Date().toISOString();
    const localTheme: CustomTheme = {
      id: crypto.randomUUID(),
      userId: activeProfileId,
      name: customName || `${sharedTheme.name} (Copy)`,
      fontFamily: sharedTheme.fontFamily,
      colors: sharedTheme.colors,
      iconColors: sharedTheme.iconColors,
      createdAt: now,
      updatedAt: now,
      isActive: false
    };

    const localThemes = readLocalThemes();
    writeLocalThemes([...localThemes, localTheme]);

    // Increment usage count
    const sharedThemes = readSharedThemes();
    const theme = sharedThemes.find((t) => t.id === sharedThemeId);
    if (theme) {
      theme.usageCount++;
      writeSharedThemes(sharedThemes);
    }

    return localTheme;
  },

  async copyVariationToLocal(
    sharedVariationId: string,
    customName?: string
  ): Promise<GameVariation> {
    const sharedVariation = readSharedVariations().find((v) => v.id === sharedVariationId);
    if (!sharedVariation) {
      throw new Error("Shared variation not found");
    }

    const activeProfileId = getActiveProfileId();
    const now = new Date().toISOString();
    const localVariation: GameVariation = {
      id: crypto.randomUUID(),
      profileId: activeProfileId,
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
      createdAt: now,
      updatedAt: now
    };

    const localVariations = readLocalVariations();
    writeLocalVariations([...localVariations, localVariation]);

    // Increment usage count
    const sharedVariations = readSharedVariations();
    const variation = sharedVariations.find((v) => v.id === sharedVariationId);
    if (variation) {
      variation.usageCount++;
      writeSharedVariations(sharedVariations);
    }

    return localVariation;
  }
};
