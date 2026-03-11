import { Router } from "express";
import Database from "better-sqlite3";
import {
  gameVariationInputSchema,
  gameVariationResponseSchema,
  gameVariationListResponseSchema
} from "@snake/contracts";
import { VariationDataService } from "../services/variationDataService";

export const createVariationRoutes = (db: Database.Database): Router => {
  const router = Router();
  const variationService = new VariationDataService(db);

  // Get all variations for active profile
  router.get("/", (req, res) => {
    try {
      const profileId = req.headers["x-profile-id"] as string;
      if (!profileId) {
        res.status(400).json({ error: "Profile ID header required" });
        return;
      }

      const variations = variationService.getVariationsByProfile(profileId);
      const response = gameVariationListResponseSchema.parse({
        variations
      });

      res.json(response);
    } catch (error) {
      console.error("Error fetching variations:", error);
      res.status(500).json({ error: "Failed to fetch variations" });
    }
  });

  // Get single variation by ID
  router.get("/:id", (req, res) => {
    try {
      const { id } = req.params;
      const variation = variationService.getVariation(id);

      if (!variation) {
        res.status(404).json({ error: "Variation not found" });
        return;
      }

      const response = gameVariationResponseSchema.parse({ variation });
      res.json(response);
    } catch (error) {
      console.error("Error fetching variation:", error);
      res.status(500).json({ error: "Failed to fetch variation" });
    }
  });

  // Create new variation
  router.post("/", (req, res) => {
    try {
      const profileId = req.headers["x-profile-id"] as string;
      if (!profileId) {
        res.status(400).json({ error: "Profile ID header required" });
        return;
      }

      const input = gameVariationInputSchema.parse(req.body);
      const variation = variationService.createVariation(profileId, input);

      const response = gameVariationResponseSchema.parse({ variation });
      res.status(201).json(response);
    } catch (error) {
      console.error("Error creating variation:", error);
      if (error instanceof Error && error.message.includes("parse")) {
        res.status(400).json({ error: "Invalid variation data" });
      } else {
        res.status(500).json({ error: "Failed to create variation" });
      }
    }
  });

  // Update variation
  router.put("/:id", (req, res) => {
    try {
      const { id } = req.params;
      const input = gameVariationInputSchema.parse(req.body);

      const variation = variationService.updateVariation(id, input);
      const response = gameVariationResponseSchema.parse({ variation });

      res.json(response);
    } catch (error) {
      console.error("Error updating variation:", error);
      if (error instanceof Error && error.message.includes("parse")) {
        res.status(400).json({ error: "Invalid variation data" });
      } else if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ error: "Variation not found" });
      } else {
        res.status(500).json({ error: "Failed to update variation" });
      }
    }
  });

  // Delete variation
  router.delete("/:id", (req, res) => {
    try {
      const { id } = req.params;
      variationService.deleteVariation(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting variation:", error);
      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ error: "Variation not found" });
      } else {
        res.status(500).json({ error: "Failed to delete variation" });
      }
    }
  });

  // Increment usage count
  router.post("/:id/use", (req, res) => {
    try {
      const { id } = req.params;
      variationService.incrementUsageCount(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error incrementing usage count:", error);
      res.status(500).json({ error: "Failed to increment usage count" });
    }
  });

  return router;
};