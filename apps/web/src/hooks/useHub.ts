import { useState, useEffect, useMemo, useCallback } from "react";
import type { SharedThemeWithCreator, SharedVariationWithCreator, HubSearchParams } from "@snake/contracts";
import { apiHubService } from "../services/adapters/apiHubService";
import { localHubService } from "../services/storage/localHubService";
import type { HubService } from "../services/hubService";
import { useProfile } from "./useProfile";
import { useTheme } from "./useTheme";
import { useVariations } from "./useVariations";

const resolveHubService = (): HubService => {
  const mode = import.meta.env.VITE_GAME_SERVICE_MODE;
  return mode === "local" ? localHubService : apiHubService;
};

export const useHub = (contentType: "themes" | "variations") => {
  const hubService = useMemo(resolveHubService, []);
  const { activeProfile } = useProfile();
  const { createTheme } = useTheme();
  const { createVariation } = useVariations(activeProfile?.id);

  const [themes, setThemes] = useState<SharedThemeWithCreator[]>([]);
  const [variations, setVariations] = useState<SharedVariationWithCreator[]>([]);
  const [themesPagination, setThemesPagination] = useState({ page: 1, totalPages: 1 });
  const [variationsPagination, setVariationsPagination] = useState({ page: 1, totalPages: 1 });
  const [favoritedThemeIds, setFavoritedThemeIds] = useState<string[]>([]);
  const [favoritedVariationIds, setFavoritedVariationIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | undefined>();
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "favorites">("recent");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchThemes = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: HubSearchParams = {
        query: query || undefined,
        difficulty,
        sortBy,
        page: currentPage,
        limit: 12
      };
      const response = await hubService.browseThemes(params);
      setThemes(response.themes);
      setThemesPagination({ page: response.pagination.page, totalPages: response.pagination.totalPages });
    } catch (error) {
      console.error("Failed to fetch themes:", error);
      setThemes([]);
    } finally {
      setIsLoading(false);
    }
  }, [hubService, query, difficulty, sortBy, currentPage]);

  const fetchVariations = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: HubSearchParams = {
        query: query || undefined,
        difficulty,
        sortBy,
        page: currentPage,
        limit: 12
      };
      const response = await hubService.browseVariations(params);
      setVariations(response.variations);
      setVariationsPagination({ page: response.pagination.page, totalPages: response.pagination.totalPages });
    } catch (error) {
      console.error("Failed to fetch variations:", error);
      setVariations([]);
    } finally {
      setIsLoading(false);
    }
  }, [hubService, query, difficulty, sortBy, currentPage]);

  const fetchFavorites = useCallback(async () => {
    if (!activeProfile) return;
    try {
      const favorites = await hubService.getUserFavorites();
      setFavoritedThemeIds(favorites.themes.map(t => t.id));
      setFavoritedVariationIds(favorites.variations.map(v => v.id));
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  }, [hubService, activeProfile]);

  useEffect(() => {
    if (contentType === "themes") {
      void fetchThemes();
    } else {
      void fetchVariations();
    }
  }, [contentType, fetchThemes, fetchVariations]);

  useEffect(() => {
    void fetchFavorites();
  }, [fetchFavorites]);

  const handleFavoriteTheme = useCallback(
    async (themeId: string) => {
      try {
        // Optimistic update
        setFavoritedThemeIds((prev) => [...prev, themeId]);
        await hubService.favoriteTheme(themeId);
      } catch (error) {
        // Rollback on error
        setFavoritedThemeIds((prev) => prev.filter((id) => id !== themeId));
        console.error("Failed to favorite theme:", error);
      }
    },
    [hubService]
  );

  const handleUnfavoriteTheme = useCallback(
    async (themeId: string) => {
      try {
        // Optimistic update
        setFavoritedThemeIds((prev) => prev.filter((id) => id !== themeId));
        await hubService.unfavoriteTheme(themeId);
      } catch (error) {
        // Rollback on error
        setFavoritedThemeIds((prev) => [...prev, themeId]);
        console.error("Failed to unfavorite theme:", error);
      }
    },
    [hubService]
  );

  const handleCopyTheme = useCallback(
    async (themeId: string) => {
      try {
        const copiedTheme = await hubService.copyThemeToLocal(themeId);
        await createTheme(copiedTheme);
      } catch (error) {
        console.error("Failed to copy theme:", error);
      }
    },
    [hubService, createTheme]
  );

  const handleFavoriteVariation = useCallback(
    async (variationId: string) => {
      try {
        // Optimistic update
        setFavoritedVariationIds((prev) => [...prev, variationId]);
        await hubService.favoriteVariation(variationId);
      } catch (error) {
        // Rollback on error
        setFavoritedVariationIds((prev) => prev.filter((id) => id !== variationId));
        console.error("Failed to favorite variation:", error);
      }
    },
    [hubService]
  );

  const handleUnfavoriteVariation = useCallback(
    async (variationId: string) => {
      try {
        // Optimistic update
        setFavoritedVariationIds((prev) => prev.filter((id) => id !== variationId));
        await hubService.unfavoriteVariation(variationId);
      } catch (error) {
        // Rollback on error
        setFavoritedVariationIds((prev) => [...prev, variationId]);
        console.error("Failed to unfavorite variation:", error);
      }
    },
    [hubService]
  );

  const handleCopyVariation = useCallback(
    async (variationId: string) => {
      try {
        const copiedVariation = await hubService.copyVariationToLocal(variationId);
        await createVariation(copiedVariation);
      } catch (error) {
        console.error("Failed to copy variation:", error);
      }
    },
    [hubService, createVariation]
  );

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
  }, []);

  const handleDifficultyChange = useCallback((newDifficulty: "easy" | "medium" | "hard" | undefined) => {
    setDifficulty(newDifficulty);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((newSortBy: "recent" | "popular" | "favorites") => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  return {
    themes,
    variations,
    themesPagination,
    variationsPagination,
    favoritedThemeIds,
    favoritedVariationIds,
    isLoading,
    query,
    difficulty,
    sortBy,
    currentPage,
    onQueryChange: handleQueryChange,
    onDifficultyChange: handleDifficultyChange,
    onSortChange: handleSortChange,
    onPageChange: handlePageChange,
    onFavoriteTheme: handleFavoriteTheme,
    onUnfavoriteTheme: handleUnfavoriteTheme,
    onCopyTheme: handleCopyTheme,
    onFavoriteVariation: handleFavoriteVariation,
    onUnfavoriteVariation: handleUnfavoriteVariation,
    onCopyVariation: handleCopyVariation
  };
};