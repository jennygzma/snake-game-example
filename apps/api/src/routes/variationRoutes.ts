import { Router } from "express";
import type Database from "better-sqlite3";
import { gameVariationInputSchema, variationResponseSchema, variationsListResponseSchema } from "@snake/contracts";
import { createVariationDataService } from "../services/variationDataService";

export const createVariationRoutes = (db: Database.Database): Router => {
  const router = Router();
  const service = createVariationDataService(db);

  // Get all variations for active profile
  router.get("/", (req, res) => {
    try {
      const profileId = req.headers["x-profile-id"] as string;
      if (!profileId) {
        res.status(400).json({ error: "x-profile-id header required" });
        return;
      }

      const variations = service.getVariationsByProfile(profileId);
      const response = variationsListResponseSchema.parse({ variations });
      res.json(response);
    } catch (error) {
      console.error("Error fetching variations:", error);
      res.status(500).json({ error: "Failed to fetch variations" });
    }
  });

  // Get single variation
  router.get("/:id", (req, res) => {
    try {
      const { id } = req.params;
      const variation = service.getVariation(id);

      if (!variation) {
        res.status(404).json({ error: "Variation not found" });
        return;
      }

      const response = variationResponseSchema.parse({ variation });
      res.json(response);
    } catch (error) {
      console.error("Error fetching variation:", error);
      res.status(500).json({ error: "Failed to fetch variation" });
    }
  });

  // Create variation
  router.post("/", (req, res) => {
    try {
      const profileId = req.headers["x-profile-id"] as string;
      if (!profileId) {
        res.status(400).json({ error: "x-profile-id header required" });
        return;
      }

      const input = gameVariationInputSchema.parse(req.body);
      const variation = service.createVariation(profileId, input);
      const response = variationResponseSchema.parse({ variation });
      res.status(201).json(response);
    } catch (error: any) {
      console.error("Error creating variation:", error);
      if (error.name === "ZodError") {
        res.status(400).json({ error: "Invalid variation data", details: error.errors });
        return;
      }
      res.status(500).json({ error: "Failed to create variation" });
    }
  });

  // Update variation
  router.put("/:id", (req, res) => {
    try {
      const profileId = req.headers["x-profile-id"] as string;
      if (!profileId) {
        res.status(400).json({ error: "x-profile-id header required" });
        return;
      }

      const { id } = req.params;
      const input = gameVariationInputSchema.parse(req.body);
      const variation = service.updateVariation(id, profileId, input);
      const response = variationResponseSchema.parse({ variation });
      res.json(response);
    } catch (error: any) {
      console.error("Error updating variation:", error);
      if (error.message.includes("not found") || error.message.includes("unauthorized")) {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.name === "ZodError") {
        res.status(400).json({ error: "Invalid variation data", details: error.errors });
        return;
      }
      res.status(500).json({ error: "Failed to update variation" });
    }
  });

  // Delete variation
  router.delete("/:id", (req, res) => {
    try {
      const profileId = req.headers["x-profile-id"] as string;
      if (!profileId) {
        res.status(400).json({ error: "x-profile-id header required" });
        return;
      }

      const { id } = req.params;
      service.deleteVariation(id, profileId);
      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting variation:", error);
      if (error.message.includes("not found") || error.message.includes("unauthorized")) {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Failed to delete variation" });
    }
  });

  // Increment usage count (called when game starts with this variation)
  router.post("/:id/use", (req, res) => {
    try {
      const { id } = req.params;
      service.incrementUsageCount(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error incrementing usage count:", error);
      res.status(500).json({ error: "Failed to update usage count" });
    }
  });

  return router;
};