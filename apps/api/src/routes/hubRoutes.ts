import express from "express";
import type { Database } from "better-sqlite3";
import {
  hubSearchParamsSchema,
  shareThemeInputSchema,
  shareVariationInputSchema
} from "@snake/contracts";
import { createHubDataService } from "../services/hubDataService";
import { profileQueries } from "../db/profileQueries";

export const createHubRoutes = (db: Database) => {
  const router = express.Router();
  const hubService = createHubDataService(db);
  const profiles = profileQueries(db);

  // Helper to get current profile ID (optional for public routes)
  const getCurrentProfileId = (): string | undefined => {
    try {
      const profile = profiles.getActive();
      return profile?.id;
    } catch {
      return undefined;
    }
  };

  // ============ PUBLIC BROWSE ENDPOINTS ============

  /**
   * GET /api/hub/themes - Browse shared themes
   */
  router.get("/themes", (req, res) => {
    try {
      const params = hubSearchParamsSchema.parse({
        query: req.query.query,
        sortBy: req.query.sortBy,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined
      });

      const currentProfileId = getCurrentProfileId();
      const response = hubService.browseThemes(params, currentProfileId);
      res.json(response);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  /**
   * GET /api/hub/variations - Browse shared variations
   */
  router.get("/variations", (req, res) => {
    try {
      const params = hubSearchParamsSchema.parse({
        query: req.query.query,
        difficulty: req.query.difficulty,
        sortBy: req.query.sortBy,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined
      });

      const currentProfileId = getCurrentProfileId();
      const response = hubService.browseVariations(params, currentProfileId);
      res.json(response);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  /**
   * GET /api/hub/themes/:id - Get a single shared theme
   */
  router.get("/themes/:id", (req, res) => {
    try {
      const currentProfileId = getCurrentProfileId();
      const response = hubService.getSharedTheme(req.params.id, currentProfileId);
      
      if (!response) {
        res.status(404).json({ error: "Shared theme not found" });
        return;
      }
      
      res.json(response);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  /**
   * GET /api/hub/variations/:id - Get a single shared variation
   */
  router.get("/variations/:id", (req, res) => {
    try {
      const currentProfileId = getCurrentProfileId();
      const response = hubService.getSharedVariation(req.params.id, currentProfileId);
      
      if (!response) {
        res.status(404).json({ error: "Shared variation not found" });
        return;
      }
      
      res.json(response);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // ============ SHARE/UNSHARE ENDPOINTS (AUTH REQUIRED) ============

  /**
   * POST /api/hub/themes - Share a theme
   */
  router.post("/themes", (req, res) => {
    try {
      const input = shareThemeInputSchema.parse(req.body);
      const response = hubService.shareTheme(input);
      res.status(201).json(response);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === "NO_ACTIVE_PROFILE") {
        res.status(401).json({ error: "No active profile" });
      } else if (errorMessage === "THEME_NOT_FOUND") {
        res.status(404).json({ error: "Theme not found" });
      } else {
        res.status(400).json({ error: errorMessage });
      }
    }
  });

  /**
   * POST /api/hub/variations - Share a variation
   */
  router.post("/variations", (req, res) => {
    try {
      const input = shareVariationInputSchema.parse(req.body);
      const response = hubService.shareVariation(input);
      res.status(201).json(response);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === "NO_ACTIVE_PROFILE") {
        res.status(401).json({ error: "No active profile" });
      } else if (errorMessage === "VARIATION_NOT_FOUND") {
        res.status(404).json({ error: "Variation not found" });
      } else {
        res.status(400).json({ error: errorMessage });
      }
    }
  });

  /**
   * DELETE /api/hub/themes/:id - Unshare a theme
   */
  router.delete("/themes/:id", (req, res) => {
    try {
      const response = hubService.unshareTheme(req.params.id);
      res.json(response);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === "NO_ACTIVE_PROFILE") {
        res.status(401).json({ error: "No active profile" });
      } else if (errorMessage === "SHARED_THEME_NOT_FOUND") {
        res.status(404).json({ error: "Shared theme not found" });
      } else if (errorMessage === "NOT_CREATOR") {
        res.status(403).json({ error: "Only the creator can unshare this theme" });
      } else {
        res.status(400).json({ error: errorMessage });
      }
    }
  });

  /**
   * DELETE /api/hub/variations/:id - Unshare a variation
   */
  router.delete("/variations/:id", (req, res) => {
    try {
      const response = hubService.unshareVariation(req.params.id);
      res.json(response);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === "NO_ACTIVE_PROFILE") {
        res.status(401).json({ error: "No active profile" });
      } else if (errorMessage === "SHARED_VARIATION_NOT_FOUND") {
        res.status(404).json({ error: "Shared variation not found" });
      } else if (errorMessage === "NOT_CREATOR") {
        res.status(403).json({ error: "Only the creator can unshare this variation" });
      } else {
        res.status(400).json({ error: errorMessage });
      }
    }
  });

  // ============ FAVORITE ENDPOINTS (AUTH REQUIRED) ============

  /**
   * POST /api/hub/themes/:id/favorite - Favorite a theme
   */
  router.post("/themes/:id/favorite", (req, res) => {
    try {
      const response = hubService.favoriteTheme(req.params.id);
      res.json(response);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === "NO_ACTIVE_PROFILE") {
        res.status(401).json({ error: "No active profile" });
      } else {
        res.status(400).json({ error: errorMessage });
      }
    }
  });

  /**
   * DELETE /api/hub/themes/:id/favorite - Unfavorite a theme
   */
  router.delete("/themes/:id/favorite", (req, res) => {
    try {
      const response = hubService.unfavoriteTheme(req.params.id);
      res.json(response);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === "NO_ACTIVE_PROFILE") {
        res.status(401).json({ error: "No active profile" });
      } else {
        res.status(400).json({ error: errorMessage });
      }
    }
  });

  /**
   * POST /api/hub/variations/:id/favorite - Favorite a variation
   */
  router.post("/variations/:id/favorite", (req, res) => {
    try {
      const response = hubService.favoriteVariation(req.params.id);
      res.json(response);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === "NO_ACTIVE_PROFILE") {
        res.status(401).json({ error: "No active profile" });
      } else {
        res.status(400).json({ error: errorMessage });
      }
    }
  });

  /**
   * DELETE /api/hub/variations/:id/favorite - Unfavorite a variation
   */
  router.delete("/variations/:id/favorite", (req, res) => {
    try {
      const response = hubService.unfavoriteVariation(req.params.id);
      res.json(response);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === "NO_ACTIVE_PROFILE") {
        res.status(401).json({ error: "No active profile" });
      } else {
        res.status(400).json({ error: errorMessage });
      }
    }
  });

  /**
   * GET /api/hub/favorites - Get user's favorites
   */
  router.get("/favorites", (req, res) => {
    try {
      const response = hubService.getUserFavorites();
      res.json(response);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === "NO_ACTIVE_PROFILE") {
        res.status(401).json({ error: "No active profile" });
      } else {
        res.status(400).json({ error: errorMessage });
      }
    }
  });

  // ============ COPY ENDPOINTS (AUTH REQUIRED) ============

  /**
   * POST /api/hub/themes/:id/copy - Copy a theme to local themes
   */
  router.post("/themes/:id/copy", (req, res) => {
    try {
      const customName = req.body.customName as string | undefined;
      const response = hubService.copyThemeToLocal(req.params.id, customName);
      res.status(201).json(response);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === "NO_ACTIVE_PROFILE") {
        res.status(401).json({ error: "No active profile" });
      } else if (errorMessage === "SHARED_THEME_NOT_FOUND") {
        res.status(404).json({ error: "Shared theme not found" });
      } else {
        res.status(400).json({ error: errorMessage });
      }
    }
  });

  /**
   * POST /api/hub/variations/:id/copy - Copy a variation to local variations
   */
  router.post("/variations/:id/copy", (req, res) => {
    try {
      const customName = req.body.customName as string | undefined;
      const response = hubService.copyVariationToLocal(req.params.id, customName);
      res.status(201).json(response);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === "NO_ACTIVE_PROFILE") {
        res.status(401).json({ error: "No active profile" });
      } else if (errorMessage === "SHARED_VARIATION_NOT_FOUND") {
        res.status(404).json({ error: "Shared variation not found" });
      } else {
        res.status(400).json({ error: errorMessage });
      }
    }
  });

  return router;
};