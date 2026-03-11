import type { GameVariation, GameVariationInput, VariationResponse, VariationsListResponse } from "@snake/contracts";

export interface VariationService {
  getVariations(): Promise<VariationsListResponse>;
  getVariation(id: string): Promise<VariationResponse>;
  createVariation(input: GameVariationInput): Promise<VariationResponse>;
  updateVariation(id: string, input: GameVariationInput): Promise<VariationResponse>;
  deleteVariation(id: string): Promise<void>;
  incrementUsageCount(id: string): Promise<void>;
}

// Determine which service to use based on environment
const useApiService = import.meta.env.VITE_USE_API === "true";

export const useVariationService = (): Promise<VariationService> => {
  if (useApiService) {
    return import("./adapters/apiVariationService").then((m) => m.apiVariationService);
  }
  return import("./storage/localVariationService").then((m) => m.localVariationService);
};
