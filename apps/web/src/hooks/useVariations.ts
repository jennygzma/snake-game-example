import { useCallback, useEffect, useState } from "react";
import type { GameVariation, GameVariationInput } from "@snake/contracts";
import { apiVariationService } from "../services/adapters/apiVariationService";
import { localVariationService } from "../services/storage/localVariationService";
import type { VariationService } from "../services/variationService";

const resolveService = (): VariationService => {
  const mode = import.meta.env.VITE_GAME_SERVICE_MODE;
  return mode === "local" ? localVariationService : apiVariationService;
};

export const useVariations = (activeProfileId?: string) => {
  const [variations, setVariations] = useState<GameVariation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const service = resolveService();

  const loadVariations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await service.getVariations();
      setVariations(response.variations);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load variations";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    void loadVariations();
  }, [loadVariations, activeProfileId]);

  const createVariation = useCallback(async (input: GameVariationInput) => {
    try {
      const response = await service.createVariation(input);
      setVariations((prev) => [...prev, response.variation]);
      return response.variation;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create variation";
      setError(message);
      throw err;
    }
  }, [service]);

  const updateVariation = useCallback(async (id: string, input: GameVariationInput) => {
    try {
      const response = await service.updateVariation(id, input);
      setVariations((prev) =>
        prev.map((v) => (v.id === id ? response.variation : v))
      );
      return response.variation;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update variation";
      setError(message);
      throw err;
    }
  }, [service]);

  const deleteVariation = useCallback(async (id: string) => {
    try {
      await service.deleteVariation(id);
      setVariations((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete variation";
      setError(message);
      throw err;
    }
  }, [service]);

  const incrementUsageCount = useCallback(async (id: string) => {
    try {
      await service.incrementUsageCount(id);
      setVariations((prev) =>
        prev.map((v) => (v.id === id ? { ...v, usageCount: v.usageCount + 1 } : v))
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update usage count";
      setError(message);
    }
  }, [service]);

  return {
    variations,
    loading,
    error,
    createVariation,
    updateVariation,
    deleteVariation,
    incrementUsageCount,
    refreshVariations: loadVariations
  };
};