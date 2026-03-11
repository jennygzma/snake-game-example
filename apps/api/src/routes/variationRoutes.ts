import { Router } from "express";
import Database from "better-sqlite3";
import {
  gameVariationInputSchema,
  gameVariationResponseSchema,
  gameVariationsResponseSchema,
} from "@snake/contracts";
import * as variationDataService from "../services/variationDataService.js";

export function createVariationRoutes(db: Database.Database): Router {
  const router = Router();

  // Create a new variation
  router.post("/", (req, res) => {
    try {
      const profileId = req.headers["x-profile-id"] as string;
      if (!profileId) {
        return res.status(400).json({ error: "Profile ID required" });
      }

      const input = gameVariationInputSchema.parse(req.body);
      const variation = variationDataService.createVariation(
        db,
        profileId,
        input
      );

      const response = gameVariationResponseSchema.parse({ variation });
      res.status(201).json(response);
    } catch (error) {
      console.error("Error creating variation:", error);
      res.status(400).json({ error: "Invalid variation data" });
    }
  });

  // Get all variations for a profile
  router.get("/", (req, res) => {
    try {
      const profileId = req.headers["x-profile-id"] as string;
      if (!profileId) {
        return res.status(400).json({ error: "Profile ID required" });
      }

      const variations = variationDataService.getVariationsByProfile(
        db,
        profileId
      );
      const response = gameVariationsResponseSchema.parse({ variations });
      res.json(response);
    } catch (error) {
      console.error("Error fetching variations:", error);
      res.status(500).json({ error: "Failed to fetch variations" });
    }
  });

  // Get active variation for a profile
  router.get("/active", (req, res) => {
    try {
      const profileId = req.headers["x-profile-id"] as string;
      if (!profileId) {
        return res.status(400).json({ error: "Profile ID required" });
      }

      const variation = variationDataService.getActiveVariation(db, profileId);
      if (!variation) {
        return res.status(404).json({ error: "No active variation found" });
      }

      const response = gameVariationResponseSchema.parse({ variation });
      res.json(response);
    } catch (error) {
      console.error("Error fetching active variation:", error);
      res.status(500).json({ error: "Failed to fetch active variation" });
    }
  });

  // Get a specific variation
  router.get("/:id", (req, res) => {
    try {
      const profileId = req.headers["x-profile-id"] as string;
      if (!profileId) {
        return res.status(400).json({ error: "Profile ID required" });
      }

      const { id } = req.params;
      const variation = variationDataService.getVariation(db, id, profileId);

      if (!variation) {
        return res.status(404).json({ error: "Variation not found" });
      }

      const response = gameVariationResponseSchema.parse({ variation });
      res.json(response);
    } catch (error) {
      console.error("Error fetching variation:", error);
      res.status(500).json({ error: "Failed to fetch variation" });
    }
  });

  // Update a variation
  router.put("/:id", (req, res) => {
    try {
      const profileId = req.headers["x-profile-id"] as string;
      if (!profileId) {
        return res.status(400).json({ error: "Profile ID required" });
      }

      const { id } = req.params;
      const updates = gameVariationInputSchema.partial().parse(req.body);

      const variation = variationDataService.updateVariation(
        db,
        id,
        profileId,
        updates
      );

      if (!variation) {
        return res.status(404).json({ error: "Variation not found" });
      }

      const response = gameVariationResponseSchema.parse({ variation });
      res.json(response);
    } catch (error) {
      console.error("Error updating variation:", error);
      res.status(400).json({ error: "Invalid variation data" });
    }
  });

  // Delete a variation
  router.delete("/:id", (req, res) => {
    try {
      const profileId = req.headers["x-profile-id"] as string;
      if (!profileId) {
        return res.status(400).json({ error: "Profile ID required" });
      }

      const { id } = req.params;
      const deleted = variationDataService.deleteVariation(db, id, profileId);

      if (!deleted) {
        return res.status(404).json({ error: "Variation not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting variation:", error);
      res.status(500).json({ error: "Failed to delete variation" });
    }
  });

  // Set active variation
  router.post("/:id/activate", (req, res) => {
    try {
      const profileId = req.headers["x-profile-id"] as string;
      if (!profileId) {
        return res.status(400).json({ error: "Profile ID required" });
      }

      const { id } = req.params;
      const success = variationDataService.setActiveVariation(
        db,
        id,
        profileId
      );

      if (!success) {
        return res.status(404).json({ error: "Variation not found" });
      }

      const variation = variationDataService.getVariation(db, id, profileId);
      const response = gameVariationResponseSchema.parse({ variation });
      res.json(response);
    } catch (error) {
      console.error("Error activating variation:", error);
      res.status(500).json({ error: "Failed to activate variation" });
    }
  });

  return router;
}