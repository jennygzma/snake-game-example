import { useState, useEffect, useCallback } from "react";
import type {
  SharedThemeWithCreator,
  SharedVariationWithCreator,
  HubSearchParams
} from "@snake/contracts";
import { apiHubService } from "../services/adapters/apiHubService";
import { localHubService } from "../services/storage/localHubService";

const USE_API = import.meta.env.VITE_USE_API === "true";
const hubService = USE_API ? apiHubService : localHubService;

interface UseHubResult {
  // Theme state
  themes: SharedThemeWithCreator[];
  themesLoading: boolean;
  themesError: string | null;
  themesFavorites: Set<string>;
  themesPage: number;
  themesTotalPages: number;

  // Variation state
  variations: SharedVariationWithCreator[];
  variationsLoading: boolean;
  variationsError: string | null;
  variationsFavorites: Set<string>;
  variationsPage: number;
  variationsTotalPages: number;

  // Filter state
  searchQuery: string;
  difficulty: "easy" | "medium" | "hard" | "";
  sortBy: "newest" | "popular" | "mostUsed";

  // Actions
  setSearchQuery: (query: string) => void;
  setDifficulty: (difficulty: "easy" | "medium" | "hard" | "") => void;
  setSortBy: (sort: "newest" | "popular" | "mostUsed") => void;
  setThemesPage: (page: number) => void;
  setVariationsPage: (page: number) => void;
  favoriteTheme: (id: string) => Promise<void>;
  unfavoriteTheme: (id: string) => Promise<void>;
  favoriteVariation: (id: string) => Promise<void>;
  unfavoriteVariation: (id: string) => Promise<void>;
  copyThemeToLocal: (id: string) => Promise<void>;
  copyVariationToLocal: (id: string) => Promise<void>;
  refreshThemes: () => Promise<void>;
  refreshVariations: () => Promise<void>;
}

export const useHub = (): UseHubResult => {
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "">("");
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "mostUsed">("newest");

  // Theme state
  const [themes, setThemes] = useState<SharedThemeWithCreator[]>([]);
  const [themesLoading, setThemesLoading] = useState(false);
  const [themesError, setThemesError] = useState<string | null>(null);
  const [themesFavorites, setThemesFavorites] = useState<Set<string>>(new Set());
  const [themesPage, setThemesPage] = useState(1);
  const [themesTotalPages, setThemesTotalPages] = useState(0);

  // Variation state
  const [variations, setVariations] = useState<SharedVariationWithCreator[]>([]);
  const [variationsLoading, setVariationsLoading] = useState(false);
  const [variationsError, setVariationsError] = useState<string | null>(null);
  const [variationsFavorites, setVariationsFavorites] = useState<Set<string>>(new Set());
  const [variationsPage, setVariationsPage] = useState(1);
  const [variationsTotalPages, setVariationsTotalPages] = useState(0);

  // Fetch themes
  const fetchThemes = useCallback(async () => {
    setThemesLoading(true);
    setThemesError(null);

    try {
      const params: HubSearchParams = {
        query: searchQuery || undefined,
        difficulty: difficulty || undefined,
        sortBy,
        page: themesPage,
        limit: 20
      };

      const response = await hubService.browseThemes(params);
      setThemes(response.themes);
      setThemesTotalPages(response.meta.totalPages);
    } catch (error) {
      setThemesError(error instanceof Error ? error.message : "Failed to load themes");
    } finally {
      setThemesLoading(false);
    }
  }, [searchQuery, difficulty, sortBy, themesPage]);

  // Fetch variations
  const fetchVariations = useCallback(async () => {
    setVariationsLoading(true);
    setVariationsError(null);

    try {
      const params: HubSearchParams = {
        query: searchQuery || undefined,
        difficulty: difficulty || undefined,
        sortBy,
        page: variationsPage,
        limit: 20
      };

      const response = await hubService.browseVariations(params);
      setVariations(response.variations);
      setVariationsTotalPages(response.meta.totalPages);
    } catch (error) {
      setVariationsError(error instanceof Error ? error.message : "Failed to load variations");
    } finally {
      setVariationsLoading(false);
    }
  }, [searchQuery, difficulty, sortBy, variationsPage]);

  // Load user favorites
  const loadFavorites = useCallback(async () => {
    try {
      const favorites = await hubService.getUserFavorites();
      setThemesFavorites(new Set(favorites.themeIds));
      setVariationsFavorites(new Set(favorites.variationIds));
    } catch (error) {
      // Silently fail - favorites are optional
      console.error("Failed to load favorites:", error);
    }
  }, []);

  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  useEffect(() => {
    fetchVariations();
  }, [fetchVariations]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Actions
  const favoriteTheme = async (id: string) => {
    try {
      await hubService.favoriteTheme(id);
      setThemesFavorites((prev) => new Set(prev).add(id));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to favorite theme");
    }
  };

  const unfavoriteTheme = async (id: string) => {
    try {
      await hubService.unfavoriteTheme(id);
      setThemesFavorites((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to unfavorite theme");
    }
  };

  const favoriteVariation = async (id: string) => {
    try {
      await hubService.favoriteVariation(id);
      setVariationsFavorites((prev) => new Set(prev).add(id));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to favorite variation");
    }
  };

  const unfavoriteVariation = async (id: string) => {
    try {
      await hubService.unfavoriteVariation(id);
      setVariationsFavorites((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to unfavorite variation");
    }
  };

  const copyThemeToLocal = async (id: string) => {
    try {
      await hubService.copyThemeToLocal(id);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to copy theme");
    }
  };

  const copyVariationToLocal = async (id: string) => {
    try {
      await hubService.copyVariationToLocal(id);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to copy variation");
    }
  };

  return {
    // Theme state
    themes,
    themesLoading,
    themesError,
    themesFavorites,
    themesPage,
    themesTotalPages,

    // Variation state
    variations,
    variationsLoading,
    variationsError,
    variationsFavorites,
    variationsPage,
    variationsTotalPages,

    // Filter state
    searchQuery,
    difficulty,
    sortBy,

    // Actions
    setSearchQuery,
    setDifficulty,
    setSortBy,
    setThemesPage,
    setVariationsPage,
    favoriteTheme,
    unfavoriteTheme,
    favoriteVariation,
    unfavoriteVariation,
    copyThemeToLocal,
    copyVariationToLocal,
    refreshThemes: fetchThemes,
    refreshVariations: fetchVariations
  };
};