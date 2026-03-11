import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Backend Services & Routes - API Validation", () => {
  it("ensures variationRoutes validates input with shared schemas", () => {
    const routesPath = path.join(process.cwd(), "../api/src/routes/variationRoutes.ts");
    const content = fs.readFileSync(routesPath, "utf-8");
    
    // Verify it imports validation schemas
    expect(content).toContain("gameVariationInputSchema");
    expect(content).toContain("gameVariationResponseSchema");
    expect(content).toContain("gameVariationListResponseSchema");
    
    // Verify it validates request bodies
    expect(content).toContain("safeParse(req.body)");
    expect(content).toContain("if (!parsedBody.success)");
    
    // Verify it validates responses
    expect(content).toContain(".parse(variationDataService");
  });

  it("ensures gameRoutes validates leaderboard query parameters", () => {
    const routesPath = path.join(process.cwd(), "../api/src/routes/gameRoutes.ts");
    const content = fs.readFileSync(routesPath, "utf-8");
    
    // Verify it imports leaderboard query schema
    expect(content).toContain("leaderboardQuerySchema");
    
    // Verify it validates query parameters
    expect(content).toContain("leaderboardQuerySchema.safeParse");
  });

  it("ensures variationDataService exists and exports required methods", () => {
    const servicePath = path.join(process.cwd(), "../api/src/services/variationDataService.ts");
    expect(fs.existsSync(servicePath)).toBe(true);
    
    const content = fs.readFileSync(servicePath, "utf-8");
    
    // Verify service methods
    expect(content).toContain("getVariations()");
    expect(content).toContain("getVariation(id: string)");
    expect(content).toContain("createVariation(input: GameVariationInput)");
    expect(content).toContain("updateVariation(id: string, input: GameVariationInput)");
    expect(content).toContain("deleteVariation(id: string)");
    expect(content).toContain("incrementUsageCount(id: string)");
  });

  it("ensures gameDataService supports variation filtering", () => {
    const servicePath = path.join(process.cwd(), "../api/src/services/gameDataService.ts");
    const content = fs.readFileSync(servicePath, "utf-8");
    
    // Verify leaderboard accepts LeaderboardQuery
    expect(content).toContain("LeaderboardQuery");
    expect(content).toContain("query?.variationId");
  });

  it("ensures variation routes are mounted in server", () => {
    const serverPath = path.join(process.cwd(), "../api/src/server.ts");
    const content = fs.readFileSync(serverPath, "utf-8");
    
    // Verify variation router is imported
    expect(content).toContain("createVariationRouter");
    
    // Verify variation routes are mounted
    expect(content).toContain('app.use("/v1/variations", createVariationRouter(db))');
  });
});