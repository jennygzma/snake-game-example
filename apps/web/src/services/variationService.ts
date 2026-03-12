import type {
  GameVariation,
  GameVariationInput,
  GameVariationListResponse,
  GameVariationResponse
} from "@snake/contracts";

export interface VariationService {
  getVariations(): Promise<GameVariationListResponse>;
  getVariation(id: string): Promise<GameVariationResponse>;
  createVariation(input: GameVariationInput): Promise<GameVariationResponse>;
  updateVariation(id: string, input: GameVariationInput): Promise<GameVariationResponse>;
  deleteVariation(id: string): Promise<void>;
  incrementUsageCount(id: string): Promise<void>;
}