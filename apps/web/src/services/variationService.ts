import type { GameVariation, GameVariationInput } from "@snake/contracts";

export interface VariationService {
  createVariation(profileId: string, input: GameVariationInput): Promise<GameVariation>;
  updateVariation(id: string, profileId: string, updates: Partial<GameVariationInput>): Promise<GameVariation>;
  deleteVariation(id: string, profileId: string): Promise<void>;
  getVariation(id: string, profileId: string): Promise<GameVariation | null>;
  getVariationsByProfile(profileId: string): Promise<GameVariation[]>;
  getActiveVariation(profileId: string): Promise<GameVariation | null>;
  setActiveVariation(id: string, profileId: string): Promise<void>;
}