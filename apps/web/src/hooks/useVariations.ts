import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameVariation, GameVariationInput } from "@snake/contracts";
import type { VariationService } from "../services/variationService";
import { apiVariationService } from "../services/adapters/apiVariationService";
import { localVariationService } from "../services/storage/localVariationService";

const resolveService = (): VariationService => {
  const mode = import.meta.env.VITE_GAME_SERVICE_MODE;
  return mode === "local" ? localVariationService : apiVariationService;
};

type UseVariationsResult = {
  variations: GameVariation[];
  loading: boolean;
  error: string | null;
  createVariation: (input: GameVariationInput) => Promise<void>;
  updateVariation: (id: string, input: GameVariationInput) => Promise<void>;
  deleteVariation: (id: string) => Promise<void>;
  incrementUsageCount: (id: string) => Promise<void>;
  refreshVariations: () => Promise<void>;
};

export const useVariations = (activeProfileId?: string): UseVariationsResult => {
  const service = useMemo(resolveService, []);
  const [variations, setVariations] = useState<GameVariation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshVariations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await service.getVariations();
      setVariations(response.variations);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load variations";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    void refreshVariations();
  }, [activeProfileId, refreshVariations]);

  const createVariation = useCallback(
    async (input: GameVariationInput) => {
      try {
        setError(null);
        await service.createVariation(input);
        await refreshVariations();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create variation";
        setError(message);
        throw err;
      }
    },
    [service, refreshVariations]
  );

  const updateVariation = useCallback(
    async (id: string, input: GameVariationInput) => {
      try {
        setError(null);
        await service.updateVariation(id, input);
        await refreshVariations();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update variation";
        setError(message);
        throw err;
      }
    },
    [service, refreshVariations]
  );

  const deleteVariation = useCallback(
    async (id: string) => {
      try {
        setError(null);
        await service.deleteVariation(id);
        await refreshVariations();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete variation";
        setError(message);
        throw err;
      }
    },
    [service, refreshVariations]
  );

  const incrementUsageCount = useCallback(
    async (id: string) => {
      try {
        await service.incrementUsageCount(id);
        await refreshVariations();
      } catch (err) {
        // Silent failure for usage tracking
        console.error("Failed to increment usage count:", err);
      }
    },
    [service, refreshVariations]
  );

  return {
    variations,
    loading,
    error,
    createVariation,
    updateVariation,
    deleteVariation,
    incrementUsageCount,
    refreshVariations
  };
};