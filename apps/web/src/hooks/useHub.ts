import { useState, useEffect, useMemo, useCallback } from "react";
import type { SharedThemeWithCreator, SharedVariationWithCreator, HubSearchParams } from "@snake/contracts";
import { apiHubService } from "../services/adapters/apiHubService";
import { localHubService } from "../services/storage/localHubService";
import type { HubService } from "../services/hubService";
import { useProfile } from "./useProfile";

const resolveHubService = (): HubService => {
  const mode = import.meta.env.VITE_GAME_SERVICE_MODE;
  return mode === "local" ? localHubService : apiHubService;
};

export const useHub = (contentType: "themes" | "variations") => {
  const hubService = useMemo(resolveHubService, []);
  const { activeProfile } = useProfile();

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
      const alreadyFavorited = favoritedThemeIds.includes(themeId);
      if (alreadyFavorited) return;
      try {
        // Optimistic update
        setFavoritedThemeIds((prev) => [...prev, themeId]);
        setThemes((prev) =>
          prev.map((theme) =>
            theme.id === themeId
              ? { ...theme, favoriteCount: theme.favoriteCount + 1 }
              : theme
          )
        );
        await hubService.favoriteTheme(themeId);
      } catch (error) {
        // Rollback on error
        setFavoritedThemeIds((prev) => prev.filter((id) => id !== themeId));
        setThemes((prev) =>
          prev.map((theme) =>
            theme.id === themeId
              ? { ...theme, favoriteCount: Math.max(0, theme.favoriteCount - 1) }
              : theme
          )
        );
        console.error("Failed to favorite theme:", error);
      }
    },
    [hubService, favoritedThemeIds]
  );

  const handleUnfavoriteTheme = useCallback(
    async (themeId: string) => {
      const isFavorited = favoritedThemeIds.includes(themeId);
      if (!isFavorited) return;
      try {
        // Optimistic update
        setFavoritedThemeIds((prev) => prev.filter((id) => id !== themeId));
        setThemes((prev) =>
          prev.map((theme) =>
            theme.id === themeId
              ? { ...theme, favoriteCount: Math.max(0, theme.favoriteCount - 1) }
              : theme
          )
        );
        await hubService.unfavoriteTheme(themeId);
      } catch (error) {
        // Rollback on error
        setFavoritedThemeIds((prev) => [...prev, themeId]);
        setThemes((prev) =>
          prev.map((theme) =>
            theme.id === themeId
              ? { ...theme, favoriteCount: theme.favoriteCount + 1 }
              : theme
          )
        );
        console.error("Failed to unfavorite theme:", error);
      }
    },
    [hubService, favoritedThemeIds]
  );

  const handleCopyTheme = useCallback(
    async (themeId: string) => {
      try {
        setThemes((prev) =>
          prev.map((theme) =>
            theme.id === themeId
              ? { ...theme, usageCount: theme.usageCount + 1 }
              : theme
          )
        );
        await hubService.copyThemeToLocal(themeId);
      } catch (error) {
        setThemes((prev) =>
          prev.map((theme) =>
            theme.id === themeId
              ? { ...theme, usageCount: Math.max(0, theme.usageCount - 1) }
              : theme
          )
        );
        console.error("Failed to copy theme:", error);
      }
    },
    [hubService]
  );

  const handleFavoriteVariation = useCallback(
    async (variationId: string) => {
      const alreadyFavorited = favoritedVariationIds.includes(variationId);
      if (alreadyFavorited) return;
      try {
        // Optimistic update
        setFavoritedVariationIds((prev) => [...prev, variationId]);
        setVariations((prev) =>
          prev.map((variation) =>
            variation.id === variationId
              ? { ...variation, favoriteCount: variation.favoriteCount + 1 }
              : variation
          )
        );
        await hubService.favoriteVariation(variationId);
      } catch (error) {
        // Rollback on error
        setFavoritedVariationIds((prev) => prev.filter((id) => id !== variationId));
        setVariations((prev) =>
          prev.map((variation) =>
            variation.id === variationId
              ? { ...variation, favoriteCount: Math.max(0, variation.favoriteCount - 1) }
              : variation
          )
        );
        console.error("Failed to favorite variation:", error);
      }
    },
    [hubService, favoritedVariationIds]
  );

  const handleUnfavoriteVariation = useCallback(
    async (variationId: string) => {
      const isFavorited = favoritedVariationIds.includes(variationId);
      if (!isFavorited) return;
      try {
        // Optimistic update
        setFavoritedVariationIds((prev) => prev.filter((id) => id !== variationId));
        setVariations((prev) =>
          prev.map((variation) =>
            variation.id === variationId
              ? { ...variation, favoriteCount: Math.max(0, variation.favoriteCount - 1) }
              : variation
          )
        );
        await hubService.unfavoriteVariation(variationId);
      } catch (error) {
        // Rollback on error
        setFavoritedVariationIds((prev) => [...prev, variationId]);
        setVariations((prev) =>
          prev.map((variation) =>
            variation.id === variationId
              ? { ...variation, favoriteCount: variation.favoriteCount + 1 }
              : variation
          )
        );
        console.error("Failed to unfavorite variation:", error);
      }
    },
    [hubService, favoritedVariationIds]
  );

  const handleCopyVariation = useCallback(
    async (variationId: string) => {
      try {
        setVariations((prev) =>
          prev.map((variation) =>
            variation.id === variationId
              ? { ...variation, usageCount: variation.usageCount + 1 }
              : variation
          )
        );
        await hubService.copyVariationToLocal(variationId);
      } catch (error) {
        setVariations((prev) =>
          prev.map((variation) =>
            variation.id === variationId
              ? { ...variation, usageCount: Math.max(0, variation.usageCount - 1) }
              : variation
          )
        );
        console.error("Failed to copy variation:", error);
      }
    },
    [hubService]
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
