import { describe, it, expect } from "vitest";
import {
  powerupTypeSchema,
  gameVariationInputSchema,
  gameVariationSchema,
  DEFAULT_CLASSIC_VARIATION
} from "@snake/contracts";

describe("Contracts & Data Model - Schema Validation", () => {
  it("validates powerup type schema correctly", () => {
    const validPowerup = {
      effect: "speed_increase" as const,
      value: 2,
      color: "#87ae73"
    };
    
    const result = powerupTypeSchema.safeParse(validPowerup);
    expect(result.success).toBe(true);
    
    // Test with optional image
    const powerupWithImage = {
      ...validPowerup,
      image: "data:image/png;base64,abc123"
    };
    expect(powerupTypeSchema.safeParse(powerupWithImage).success).toBe(true);
  });

  it("rejects invalid powerup effects", () => {
    const invalidPowerup = {
      effect: "invalid_effect",
      value: 2,
      color: "#87ae73"
    };
    
    const result = powerupTypeSchema.safeParse(invalidPowerup);
    expect(result.success).toBe(false);
  });

  it("validates game variation input schema", () => {
    const validInput = {
      name: "Speed Demon",
      description: "Fast-paced gameplay",
      difficulty: "hard" as const,
      baseSpeed: 15,
      gridSize: 20,
      maxConcurrentFoods: 3,
      powerupTypes: [
        {
          effect: "speed_increase" as const,
          value: 2,
          color: "#5BB9C2"
        },
        {
          effect: "double_points" as const,
          value: 2,
          color: "#FDB813"
        }
      ]
    };
    
    const result = gameVariationInputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("validates game variation schema with database fields", () => {
    const validVariation = {
      id: "var-123",
      profileId: "profile-456",
      name: "Classic",
      baseSpeed: 8,
      gridSize: 20,
      maxConcurrentFoods: 1,
      powerupTypes: [
        {
          effect: "double_points" as const,
          value: 1,
          color: "#87ae73"
        }
      ],
      usageCount: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const result = gameVariationSchema.safeParse(validVariation);
    expect(result.success).toBe(true);
  });

  it("enforces name length constraints", () => {
    const tooLong = {
      name: "a".repeat(101),
      baseSpeed: 8,
      gridSize: 20,
      maxConcurrentFoods: 1,
      powerupTypes: [DEFAULT_CLASSIC_VARIATION.powerupTypes[0]]
    };
    
    expect(gameVariationInputSchema.safeParse(tooLong).success).toBe(false);
  });

  it("enforces valid difficulty values", () => {
    const invalidDifficulty = {
      name: "Test",
      difficulty: "extreme",
      baseSpeed: 8,
      gridSize: 20,
      maxConcurrentFoods: 1,
      powerupTypes: [DEFAULT_CLASSIC_VARIATION.powerupTypes[0]]
    };
    
    expect(gameVariationInputSchema.safeParse(invalidDifficulty).success).toBe(false);
  });

  it("enforces speed range constraints", () => {
    const tooSlow = {
      name: "Test",
      baseSpeed: 0,
      gridSize: 20,
      maxConcurrentFoods: 1,
      powerupTypes: [DEFAULT_CLASSIC_VARIATION.powerupTypes[0]]
    };
    expect(gameVariationInputSchema.safeParse(tooSlow).success).toBe(false);
    
    const tooFast = {
      name: "Test",
      baseSpeed: 31,
      gridSize: 20,
      maxConcurrentFoods: 1,
      powerupTypes: [DEFAULT_CLASSIC_VARIATION.powerupTypes[0]]
    };
    expect(gameVariationInputSchema.safeParse(tooFast).success).toBe(false);
  });

  it("enforces grid size constraints", () => {
    const tooSmall = {
      name: "Test",
      baseSpeed: 8,
      gridSize: 7,
      maxConcurrentFoods: 1,
      powerupTypes: [DEFAULT_CLASSIC_VARIATION.powerupTypes[0]]
    };
    expect(gameVariationInputSchema.safeParse(tooSmall).success).toBe(false);
    
    const tooLarge = {
      name: "Test",
      baseSpeed: 8,
      gridSize: 65,
      maxConcurrentFoods: 1,
      powerupTypes: [DEFAULT_CLASSIC_VARIATION.powerupTypes[0]]
    };
    expect(gameVariationInputSchema.safeParse(tooLarge).success).toBe(false);
  });

  it("enforces max concurrent foods constraints", () => {
    const tooFew = {
      name: "Test",
      baseSpeed: 8,
      gridSize: 20,
      maxConcurrentFoods: 0,
      powerupTypes: [DEFAULT_CLASSIC_VARIATION.powerupTypes[0]]
    };
    expect(gameVariationInputSchema.safeParse(tooFew).success).toBe(false);
    
    const tooMany = {
      name: "Test",
      baseSpeed: 8,
      gridSize: 20,
      maxConcurrentFoods: 11,
      powerupTypes: [DEFAULT_CLASSIC_VARIATION.powerupTypes[0]]
    };
    expect(gameVariationInputSchema.safeParse(tooMany).success).toBe(false);
  });
});