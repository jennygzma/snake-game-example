import { useState, useEffect, useCallback } from "react";
import type {
  HubSearchParams,
  SharedThemeWithCreator,
  SharedVariationWithCreator,
  ShareThemeInput,
  ShareVariationInput
} from "@snake/contracts";
import { apiHubService } from "../services/adapters/apiHubService";
import { localHubService } from "../services/storage/localHubService";
import type { HubService } from "../services/hubService";

const resolveHubService = (): HubService => {
  const mode = import.meta.env.VITE_GAME_SERVICE_MODE;
  return mode === "local" ? localHubService : apiHubService;
};

export const useHub = (contentType: "themes" | "variations") => {
  const hubService = resolveHubService();

  const [items, setItems] = useState<(SharedThemeWithCreator | SharedVariationWithCreator)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Search/filter state
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | undefined>(undefined);
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "favorites">("newest");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: HubSearchParams = {
        query: query || undefined,
        difficulty: contentType === "variations" ? difficulty : undefined,
        sortBy,
        page,
        limit: 20
      };

      if (contentType === "themes") {
        const response = await hubService.browseThemes(params);
        setItems(response.themes);
        setTotal(response.total);
        setHasMore(response.hasMore);
      } else {
        const response = await hubService.browseVariations(params);
        setItems(response.variations);
        setTotal(response.total);
        setHasMore(response.hasMore);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [hubService, contentType, query, difficulty, sortBy, page]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const shareTheme = async (input: ShareThemeInput): Promise<void> => {
    try {
      await hubService.shareTheme(input);
      await fetchItems(); // Refresh to show newly shared item
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  const shareVariation = async (input: ShareVariationInput): Promise<void> => {
    try {
      await hubService.shareVariation(input);
      await fetchItems(); // Refresh to show newly shared item
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  const favoriteItem = async (sharedId: string): Promise<void> => {
    try {
      if (contentType === "themes") {
        const response = await hubService.favoriteTheme(sharedId);
        // Optimistic update
        setItems((prev) =>
          prev.map((item) =>
            item.id === sharedId
              ? { ...item, isFavorited: true, favoriteCount: response.favoriteCount }
              : item
          )
        );
      } else {
        const response = await hubService.favoriteVariation(sharedId);
        setItems((prev) =>
          prev.map((item) =>
            item.id === sharedId
              ? { ...item, isFavorited: true, favoriteCount: response.favoriteCount }
              : item
          )
        );
      }
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  const unfavoriteItem = async (sharedId: string): Promise<void> => {
    try {
      if (contentType === "themes") {
        const response = await hubService.unfavoriteTheme(sharedId);
        // Optimistic update
        setItems((prev) =>
          prev.map((item) =>
            item.id === sharedId
              ? { ...item, isFavorited: false, favoriteCount: response.favoriteCount }
              : item
          )
        );
      } else {
        const response = await hubService.unfavoriteVariation(sharedId);
        setItems((prev) =>
          prev.map((item) =>
            item.id === sharedId
              ? { ...item, isFavorited: false, favoriteCount: response.favoriteCount }
              : item
          )
        );
      }
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  const copyToLocal = async (sharedId: string, customName?: string): Promise<void> => {
    try {
      if (contentType === "themes") {
        await hubService.copyThemeToLocal(sharedId, customName);
        // Increment usage count optimistically
        setItems((prev) =>
          prev.map((item) =>
            item.id === sharedId ? { ...item, usageCount: item.usageCount + 1 } : item
          )
        );
      } else {
        await hubService.copyVariationToLocal(sharedId, customName);
        setItems((prev) =>
          prev.map((item) =>
            item.id === sharedId ? { ...item, usageCount: item.usageCount + 1 } : item
          )
        );
      }
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1); // Reset to first page on search
  };

  const handleDifficultyChange = (newDifficulty: "easy" | "medium" | "hard" | undefined) => {
    setDifficulty(newDifficulty);
    setPage(1); // Reset to first page on filter change
  };

  const handleSortChange = (newSort: "newest" | "popular" | "favorites") => {
    setSortBy(newSort);
    setPage(1); // Reset to first page on sort change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    items,
    loading,
    error,
    total,
    page,
    hasMore,
    query,
    difficulty,
    sortBy,
    handleSearch,
    handleDifficultyChange,
    handleSortChange,
    handlePageChange,
    shareTheme,
    shareVariation,
    favoriteItem,
    unfavoriteItem,
    copyToLocal,
    refresh: fetchItems
  };
};