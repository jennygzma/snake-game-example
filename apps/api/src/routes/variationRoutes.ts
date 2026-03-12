import { Router, type Response } from "express";
import type { Database } from "better-sqlite3";
import {
  gameVariationInputSchema,
  gameVariationListResponseSchema,
  gameVariationResponseSchema
} from "@snake/contracts";
import { createVariationDataService } from "../services/variationDataService";

export const createVariationRouter = (db: Database) => {
  const variationDataService = createVariationDataService(db);
  const variationRouter = Router();
  
  const sendNoActiveProfile = (res: Response) => {
    res.status(404).json({ message: "No active profile found" });
  };

  // GET /variations - List all variations for active profile
  variationRouter.get("/", (_req, res) => {
    try {
      const payload = gameVariationListResponseSchema.parse(variationDataService.getVariations());
      res.json(payload);
    } catch (error) {
      if (error instanceof Error && error.message === "NO_ACTIVE_PROFILE") {
        sendNoActiveProfile(res);
        return;
      }
      throw error;
    }
  });

  // GET /variations/:id - Get a specific variation
  variationRouter.get("/:id", (req, res) => {
    try {
      const payload = gameVariationResponseSchema.parse(variationDataService.getVariation(req.params.id));
      res.json(payload);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "NO_ACTIVE_PROFILE") {
          sendNoActiveProfile(res);
          return;
        }
        if (error.message === "VARIATION_NOT_FOUND") {
          res.status(404).json({ message: "Variation not found" });
          return;
        }
      }
      throw error;
    }
  });

  // POST /variations - Create a new variation
  variationRouter.post("/", (req, res) => {
    const parsedBody = gameVariationInputSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ message: "Invalid variation payload", errors: parsedBody.error.errors });
      return;
    }

    try {
      const payload = gameVariationResponseSchema.parse(variationDataService.createVariation(parsedBody.data));
      res.status(201).json(payload);
    } catch (error) {
      if (error instanceof Error && error.message === "NO_ACTIVE_PROFILE") {
        sendNoActiveProfile(res);
        return;
      }
      throw error;
    }
  });

  // PUT /variations/:id - Update a variation
  variationRouter.put("/:id", (req, res) => {
    const parsedBody = gameVariationInputSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ message: "Invalid variation payload", errors: parsedBody.error.errors });
      return;
    }

    try {
      const payload = gameVariationResponseSchema.parse(variationDataService.updateVariation(req.params.id, parsedBody.data));
      res.json(payload);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "NO_ACTIVE_PROFILE") {
          sendNoActiveProfile(res);
          return;
        }
        if (error.message.includes("not found")) {
          res.status(404).json({ message: "Variation not found" });
          return;
        }
      }
      throw error;
    }
  });

  // DELETE /variations/:id - Delete a variation
  variationRouter.delete("/:id", (req, res) => {
    try {
      variationDataService.deleteVariation(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "NO_ACTIVE_PROFILE") {
          sendNoActiveProfile(res);
          return;
        }
        if (error.message.includes("not found")) {
          res.status(404).json({ message: "Variation not found" });
          return;
        }
      }
      throw error;
    }
  });

  // POST /variations/:id/increment-usage - Increment usage count
  variationRouter.post("/:id/increment-usage", (req, res) => {
    try {
      variationDataService.incrementUsageCount(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === "NO_ACTIVE_PROFILE") {
        sendNoActiveProfile(res);
        return;
      }
      throw error;
    }
  });

  return variationRouter;
};