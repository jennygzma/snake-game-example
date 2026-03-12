import { useState, useEffect, useCallback, useMemo } from "react";
import type { HubThemesResponse, HubVariationsResponse, HubSearchParams } from "@snake/contracts";
import { apiHubService } from "../services/adapters/apiHubService";
import { localHubService } from "../services/storage/localHubService";
import type { HubService } from "../services/hubService";

type ContentType = "themes" | "variations";
type HubItem = HubThemesResponse["themes"][number] | HubVariationsResponse["variations"][number];

interface UseHubResult {
  items: HubItem[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  filters: HubSearchParams;
  updateFilters: (updates: Partial<HubSearchParams>) => void;
  favorite: (id: string) => Promise<void>;
  unfavorite: (id: string) => Promise<void>;
  copy: (id: string, customName?: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const resolveHubService = (): HubService => {
  const mode = import.meta.env.VITE_GAME_SERVICE_MODE;
  return mode === "local" ? localHubService : apiHubService;
};

export const useHub = (contentType: ContentType): UseHubResult => {
  const hubService = useMemo(resolveHubService, []);
  
  const [items, setItems] = useState<HubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<HubSearchParams>({
    page: 1,
    limit: 12,
    sortBy: "recent"
  });

  const browse = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (contentType === "themes") {
        const response = await hubService.browseThemes(filters);
        setItems(response.themes);
        setTotalPages(Math.ceil(response.total / (filters.limit || 12)));
      } else {
        const response = await hubService.browseVariations(filters);
        setItems(response.variations);
        setTotalPages(Math.ceil(response.total / (filters.limit || 12)));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load items");
    } finally {
      setLoading(false);
    }
  }, [hubService, contentType, filters]);

  useEffect(() => {
    void browse();
  }, [browse]);

  const updateFilters = useCallback((updates: Partial<HubSearchParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...updates,
      // Reset to page 1 when filters change (except when explicitly setting page)
      page: updates.page !== undefined ? updates.page : 1
    }));
  }, []);

  const favorite = useCallback(async (id: string) => {
    // Optimistic update
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, favoriteCount: item.favoriteCount + 1, isFavorited: true }
          : item
      )
    );

    try {
      if (contentType === "themes") {
        await hubService.favoriteTheme(id);
      } else {
        await hubService.favoriteVariation(id);
      }
    } catch (err) {
      // Rollback on error
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? { ...item, favoriteCount: item.favoriteCount - 1, isFavorited: false }
            : item
        )
      );
      setError(err instanceof Error ? err.message : "Failed to favorite");
      throw err;
    }
  }, [hubService, contentType]);

  const unfavorite = useCallback(async (id: string) => {
    // Optimistic update
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, favoriteCount: item.favoriteCount - 1, isFavorited: false }
          : item
      )
    );

    try {
      if (contentType === "themes") {
        await hubService.unfavoriteTheme(id);
      } else {
        await hubService.unfavoriteVariation(id);
      }
    } catch (err) {
      // Rollback on error
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? { ...item, favoriteCount: item.favoriteCount + 1, isFavorited: true }
            : item
        )
      );
      setError(err instanceof Error ? err.message : "Failed to unfavorite");
      throw err;
    }
  }, [hubService, contentType]);

  const copy = useCallback(async (id: string, customName?: string) => {
    try {
      if (contentType === "themes") {
        await hubService.copyThemeToLocal(id, customName);
      } else {
        await hubService.copyVariationToLocal(id, customName);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to copy");
      throw err;
    }
  }, [hubService, contentType]);

  const refetch = useCallback(async () => {
    await browse();
  }, [browse]);

  return {
    items,
    loading,
    error,
    totalPages,
    currentPage: filters.page || 1,
    filters,
    updateFilters,
    favorite,
    unfavorite,
    copy,
    refetch
  };
};