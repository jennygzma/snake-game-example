import { useState, useEffect, useCallback } from "react";
import type { GameVariation, GameVariationInput } from "@snake/contracts";
import { useVariationService } from "../services/variationService";

export const useVariation = () => {
  const [variations, setVariations] = useState<GameVariation[]>([]);
  const [activeVariation, setActiveVariation] = useState<GameVariation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVariations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const service = await useVariationService();
      const response = await service.getVariations();
      setVariations(response.variations);

      // Load active variation from localStorage
      const activeId = localStorage.getItem("activeVariationId");
      if (activeId) {
        const active = response.variations.find((v) => v.id === activeId);
        setActiveVariation(active || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load variations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVariations();
  }, [loadVariations]);

  const createVariation = useCallback(
    async (input: GameVariationInput) => {
      try {
        setError(null);
        const service = await useVariationService();
        const response = await service.createVariation(input);
        await loadVariations();
        return response.variation;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create variation";
        setError(message);
        throw new Error(message);
      }
    },
    [loadVariations]
  );

  const updateVariation = useCallback(
    async (id: string, input: GameVariationInput) => {
      try {
        setError(null);
        const service = await useVariationService();
        const response = await service.updateVariation(id, input);
        await loadVariations();
        return response.variation;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update variation";
        setError(message);
        throw new Error(message);
      }
    },
    [loadVariations]
  );

  const deleteVariation = useCallback(
    async (id: string) => {
      try {
        setError(null);
        const service = await useVariationService();
        await service.deleteVariation(id);
        
        // Clear active variation if it was deleted
        if (activeVariation?.id === id) {
          setActiveVariation(null);
          localStorage.removeItem("activeVariationId");
        }
        
        await loadVariations();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete variation";
        setError(message);
        throw new Error(message);
      }
    },
    [loadVariations, activeVariation]
  );

  const activateVariation = useCallback(
    async (id: string) => {
      const variation = variations.find((v) => v.id === id);
      if (!variation) {
        throw new Error("Variation not found");
      }
      
      setActiveVariation(variation);
      localStorage.setItem("activeVariationId", id);
      
      // Increment usage count
      const service = await useVariationService();
      await service.incrementUsageCount(id);
    },
    [variations]
  );

  const clearActiveVariation = useCallback(() => {
    setActiveVariation(null);
    localStorage.removeItem("activeVariationId");
  }, []);

  return {
    variations,
    activeVariation,
    loading,
    error,
    createVariation,
    updateVariation,
    deleteVariation,
    activateVariation,
    clearActiveVariation,
    refreshVariations: loadVariations
  };
};