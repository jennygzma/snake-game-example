import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Database Schema - Query Boundaries", () => {
  it("ensures all variation database queries are in dedicated variationQueries.ts file", () => {
    const variationQueriesPath = path.join(process.cwd(), "../api/src/db/variationQueries.ts");
    expect(fs.existsSync(variationQueriesPath)).toBe(true);
    
    const content = fs.readFileSync(variationQueriesPath, "utf-8");
    
    // Verify key query methods exist
    expect(content).toContain("getVariationsByProfileId");
    expect(content).toContain("getVariationById");
    expect(content).toContain("createVariation");
    expect(content).toContain("updateVariation");
    expect(content).toContain("deleteVariation");
    expect(content).toContain("incrementUsageCount");
    
    // Verify it uses Database type
    expect(content).toContain("Database");
    expect(content).toContain("db.prepare");
  });

  it("ensures gameQueries.ts was updated to support variation_id", () => {
    const gameQueriesPath = path.join(process.cwd(), "../api/src/db/gameQueries.ts");
    const content = fs.readFileSync(gameQueriesPath, "utf-8");
    
    // Verify variation_id support in saveRun
    expect(content).toContain("variation_id");
    expect(content).toContain("variationId");
    
    // Verify leaderboard supports variation filtering
    expect(content).toContain("variationName");
  });

  it("ensures schema.sql has game_variations table", () => {
    const schemaPath = path.join(process.cwd(), "../api/src/db/schema.sql");
    const content = fs.readFileSync(schemaPath, "utf-8");
    
    // Verify game_variations table exists
    expect(content).toContain("CREATE TABLE IF NOT EXISTS game_variations");
    expect(content).toContain("profile_id TEXT NOT NULL");
    expect(content).toContain("powerup_types TEXT NOT NULL");
    expect(content).toContain("max_concurrent_foods INTEGER NOT NULL");
    
    // Verify foreign key constraint
    expect(content).toContain("FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE");
  });

  it("ensures migration file exists for game variations", () => {
    const migrationPath = path.join(process.cwd(), "../api/src/db/migrations/002_add_game_variations.ts");
    expect(fs.existsSync(migrationPath)).toBe(true);
    
    const content = fs.readFileSync(migrationPath, "utf-8");
    
    // Verify migration creates Classic variations
    expect(content).toContain("Classic");
    expect(content).toContain("INSERT INTO game_variations");
    expect(content).toContain("double_points");
    
    // Verify backfill logic
    expect(content).toContain("UPDATE game_runs");
    expect(content).toContain("variation_id");
  });
});