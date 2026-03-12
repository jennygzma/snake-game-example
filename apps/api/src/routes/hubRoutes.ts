import { Router } from "express";
import type { Database } from "better-sqlite3";
import {
  hubSearchParamsSchema,
  shareThemeInputSchema,
  shareVariationInputSchema,
  updateSharedThemeInputSchema,
  updateSharedVariationInputSchema,
  hubThemesResponseSchema,
  hubVariationsResponseSchema,
  shareResponseSchema,
  copyToLocalResponseSchema,
  favoritesResponseSchema
} from "@snake/contracts";
import { createHubDataService } from "../services/hubDataService";
import { profileQueries } from "../db/profileQueries";

export const createHubRouter = (db: Database) => {
  const hubService = createHubDataService(db);
  const profileQs = profileQueries(db);
  const router = Router();

  // Helper to get requesting profile ID (optional for public routes)
  const getRequestingProfileId = (): string | undefined => {
    const activeProfile = profileQs.getActive();
    return activeProfile?.id;
  };

  // ========================================================================
  // Browse & Discovery (Public)
  // ========================================================================

  /**
   * GET /hub/themes - Browse shared themes
   */
  router.get("/themes", (req, res) => {
    const parsedParams = hubSearchParamsSchema.safeParse({
      query: req.query.query,
      difficulty: req.query.difficulty,
      sortBy: req.query.sortBy || "recent",
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20
    });

    if (!parsedParams.success) {
      res.status(400).json({ message: "Invalid search parameters", errors: parsedParams.error.errors });
      return;
    }

    const requestingProfileId = getRequestingProfileId();
    const payload = hubThemesResponseSchema.parse(
      hubService.browseThemes(parsedParams.data, requestingProfileId)
    );
    res.json(payload);
  });

  /**
   * GET /hub/themes/:id - Get a specific shared theme
   */
  router.get("/themes/:id", (req, res) => {
    const requestingProfileId = getRequestingProfileId();
    const theme = hubService.getSharedTheme(req.params.id, requestingProfileId);

    if (!theme) {
      res.status(404).json({ message: "Theme not found" });
      return;
    }

    res.json({ theme });
  });

  /**
   * GET /hub/variations - Browse shared variations
   */
  router.get("/variations", (req, res) => {
    const parsedParams = hubSearchParamsSchema.safeParse({
      query: req.query.query,
      difficulty: req.query.difficulty,
      sortBy: req.query.sortBy || "recent",
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20
    });

    if (!parsedParams.success) {
      res.status(400).json({ message: "Invalid search parameters", errors: parsedParams.error.errors });
      return;
    }

    const requestingProfileId = getRequestingProfileId();
    const payload = hubVariationsResponseSchema.parse(
      hubService.browseVariations(parsedParams.data, requestingProfileId)
    );
    res.json(payload);
  });

  /**
   * GET /hub/variations/:id - Get a specific shared variation
   */
  router.get("/variations/:id", (req, res) => {
    const requestingProfileId = getRequestingProfileId();
    const variation = hubService.getSharedVariation(req.params.id, requestingProfileId);

    if (!variation) {
      res.status(404).json({ message: "Variation not found" });
      return;
    }

    res.json({ variation });
  });

  // ========================================================================
  // Share Operations (Auth Required)
  // ========================================================================

  /**
   * POST /hub/themes - Share a theme to the hub
   */
  router.post("/themes", (req, res) => {
    const parsedBody = shareThemeInputSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ message: "Invalid share theme payload", errors: parsedBody.error.errors });
      return;
    }

    try {
      const payload = shareResponseSchema.parse(hubService.shareTheme(parsedBody.data));
      res.status(201).json(payload);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to share theme" });
    }
  });

  /**
   * PUT /hub/themes/:id - Update a shared theme
   */
  router.put("/themes/:id", (req, res) => {
    const parsedBody = updateSharedThemeInputSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ message: "Invalid update payload", errors: parsedBody.error.errors });
      return;
    }

    try {
      const result = hubService.updateSharedTheme(req.params.id, parsedBody.data);
      if (!result) {
        res.status(404).json({ message: "Theme not found" });
        return;
      }
      res.json({ theme: result });
    } catch (error) {
      res.status(403).json({ message: error instanceof Error ? error.message : "Not authorized" });
    }
  });

  /**
   * DELETE /hub/themes/:id - Unshare a theme
   */
  router.delete("/themes/:id", (req, res) => {
    try {
      const success = hubService.unshareTheme(req.params.id);
      if (!success) {
        res.status(404).json({ message: "Theme not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(403).json({ message: error instanceof Error ? error.message : "Not authorized" });
    }
  });

  /**
   * POST /hub/variations - Share a variation to the hub
   */
  router.post("/variations", (req, res) => {
    const parsedBody = shareVariationInputSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ message: "Invalid share variation payload", errors: parsedBody.error.errors });
      return;
    }

    try {
      const payload = shareResponseSchema.parse(hubService.shareVariation(parsedBody.data));
      res.status(201).json(payload);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to share variation" });
    }
  });

  /**
   * PUT /hub/variations/:id - Update a shared variation
   */
  router.put("/variations/:id", (req, res) => {
    const parsedBody = updateSharedVariationInputSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ message: "Invalid update payload", errors: parsedBody.error.errors });
      return;
    }

    try {
      const result = hubService.updateSharedVariation(req.params.id, parsedBody.data);
      if (!result) {
        res.status(404).json({ message: "Variation not found" });
        return;
      }
      res.json({ variation: result });
    } catch (error) {
      res.status(403).json({ message: error instanceof Error ? error.message : "Not authorized" });
    }
  });

  /**
   * DELETE /hub/variations/:id - Unshare a variation
   */
  router.delete("/variations/:id", (req, res) => {
    try {
      const success = hubService.unshareVariation(req.params.id);
      if (!success) {
        res.status(404).json({ message: "Variation not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(403).json({ message: error instanceof Error ? error.message : "Not authorized" });
    }
  });

  // ========================================================================
  // Favorite Operations (Auth Required)
  // ========================================================================

  /**
   * POST /hub/themes/:id/favorite - Favorite a theme
   */
  router.post("/themes/:id/favorite", (req, res) => {
    try {
      hubService.favoriteTheme(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to favorite theme" });
    }
  });

  /**
   * DELETE /hub/themes/:id/favorite - Unfavorite a theme
   */
  router.delete("/themes/:id/favorite", (req, res) => {
    try {
      hubService.unfavoriteTheme(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to unfavorite theme" });
    }
  });

  /**
   * POST /hub/variations/:id/favorite - Favorite a variation
   */
  router.post("/variations/:id/favorite", (req, res) => {
    try {
      hubService.favoriteVariation(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to favorite variation" });
    }
  });

  /**
   * DELETE /hub/variations/:id/favorite - Unfavorite a variation
   */
  router.delete("/variations/:id/favorite", (req, res) => {
    try {
      hubService.unfavoriteVariation(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to unfavorite variation" });
    }
  });

  /**
   * GET /hub/favorites - Get user's favorites
   */
  router.get("/favorites", (req, res) => {
    try {
      const payload = favoritesResponseSchema.parse(hubService.getUserFavorites());
      res.json(payload);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to get favorites" });
    }
  });

  // ========================================================================
  // Copy Operations (Auth Required)
  // ========================================================================

  /**
   * POST /hub/themes/:id/copy - Copy a theme to local collection
   */
  router.post("/themes/:id/copy", (req, res) => {
    try {
      const customName = req.body.customName as string | undefined;
      const payload = copyToLocalResponseSchema.parse(
        hubService.copyThemeToLocal(req.params.id, customName)
      );
      res.status(201).json(payload);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to copy theme" });
    }
  });

  /**
   * POST /hub/variations/:id/copy - Copy a variation to local collection
   */
  router.post("/variations/:id/copy", (req, res) => {
    try {
      const customName = req.body.customName as string | undefined;
      const payload = copyToLocalResponseSchema.parse(
        hubService.copyVariationToLocal(req.params.id, customName)
      );
      res.status(201).json(payload);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to copy variation" });
    }
  });

  return router;
};