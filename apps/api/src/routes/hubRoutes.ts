import { Router } from "express";
import type { Database } from "better-sqlite3";
import {
  hubSearchParamsSchema,
  shareThemeInputSchema,
  shareVariationInputSchema,
  hubThemesResponseSchema,
  hubVariationsResponseSchema,
  sharedThemeResponseSchema,
  sharedVariationResponseSchema,
  shareResponseSchema,
  unshareResponseSchema,
  favoriteResponseSchema,
  unfavoriteResponseSchema,
  userFavoritesResponseSchema,
  copyThemeToLocalResponseSchema,
  copyVariationToLocalResponseSchema
} from "@snake/contracts";
import { createHubDataService } from "../services/hubDataService";
import { profileQueries } from "../db/profileQueries";

export const createHubRouter = (db: Database) => {
  const hubService = createHubDataService(db);
  const profileQs = profileQueries(db);
  const router = Router();

  // ==================== Public Browse Endpoints ====================

  /**
   * GET /hub/themes - Browse shared themes
   */
  router.get("/themes", (req, res) => {
    const params = hubSearchParamsSchema.parse({
      query: req.query.query,
      difficulty: req.query.difficulty,
      sortBy: req.query.sortBy || "recent",
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20
    });

    const payload = hubThemesResponseSchema.parse(hubService.browseThemes(params));
    res.json(payload);
  });

  /**
   * GET /hub/themes/:id - Get a specific shared theme
   */
  router.get("/themes/:id", (req, res) => {
    const result = hubService.getSharedTheme(req.params.id);
    if (!result) {
      res.status(404).json({ message: "Shared theme not found" });
      return;
    }
    const payload = sharedThemeResponseSchema.parse(result);
    res.json(payload);
  });

  /**
   * GET /hub/variations - Browse shared variations
   */
  router.get("/variations", (req, res) => {
    const params = hubSearchParamsSchema.parse({
      query: req.query.query,
      difficulty: req.query.difficulty,
      sortBy: req.query.sortBy || "recent",
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20
    });

    const payload = hubVariationsResponseSchema.parse(hubService.browseVariations(params));
    res.json(payload);
  });

  /**
   * GET /hub/variations/:id - Get a specific shared variation
   */
  router.get("/variations/:id", (req, res) => {
    const result = hubService.getSharedVariation(req.params.id);
    if (!result) {
      res.status(404).json({ message: "Shared variation not found" });
      return;
    }
    const payload = sharedVariationResponseSchema.parse(result);
    res.json(payload);
  });

  // ==================== Creator Operations (Auth Required) ====================

  /**
   * POST /hub/themes - Share a theme to the hub
   */
  router.post("/themes", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    const parsedBody = shareThemeInputSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ message: "Invalid request body", errors: parsedBody.error.errors });
      return;
    }

    const result = hubService.shareTheme(activeProfile.id, parsedBody.data);
    if (!result) {
      res.status(404).json({ message: "Theme not found or already shared" });
      return;
    }

    const payload = shareResponseSchema.parse(result);
    res.status(201).json(payload);
  });

  /**
   * PUT /hub/themes/:id - Update a shared theme (creator only)
   */
  router.put("/themes/:id", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    const { description } = req.body;
    if (typeof description !== "string") {
      res.status(400).json({ message: "Description must be a string" });
      return;
    }

    const result = hubService.updateSharedTheme(req.params.id, activeProfile.id, description);
    if (!result) {
      res.status(404).json({ message: "Shared theme not found or not creator" });
      return;
    }

    const payload = unshareResponseSchema.parse(result);
    res.json(payload);
  });

  /**
   * DELETE /hub/themes/:id - Unshare a theme (creator only)
   */
  router.delete("/themes/:id", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    const result = hubService.unshareTheme(req.params.id, activeProfile.id);
    if (!result) {
      res.status(404).json({ message: "Shared theme not found or not creator" });
      return;
    }

    const payload = unshareResponseSchema.parse(result);
    res.json(payload);
  });

  /**
   * POST /hub/variations - Share a variation to the hub
   */
  router.post("/variations", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    const parsedBody = shareVariationInputSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ message: "Invalid request body", errors: parsedBody.error.errors });
      return;
    }

    const result = hubService.shareVariation(activeProfile.id, parsedBody.data);
    if (!result) {
      res.status(404).json({ message: "Variation not found or already shared" });
      return;
    }

    const payload = shareResponseSchema.parse(result);
    res.status(201).json(payload);
  });

  /**
   * PUT /hub/variations/:id - Update a shared variation (creator only)
   */
  router.put("/variations/:id", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    const { description } = req.body;
    if (typeof description !== "string") {
      res.status(400).json({ message: "Description must be a string" });
      return;
    }

    const result = hubService.updateSharedVariation(req.params.id, activeProfile.id, description);
    if (!result) {
      res.status(404).json({ message: "Shared variation not found or not creator" });
      return;
    }

    const payload = unshareResponseSchema.parse(result);
    res.json(payload);
  });

  /**
   * DELETE /hub/variations/:id - Unshare a variation (creator only)
   */
  router.delete("/variations/:id", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    const result = hubService.unshareVariation(req.params.id, activeProfile.id);
    if (!result) {
      res.status(404).json({ message: "Shared variation not found or not creator" });
      return;
    }

    const payload = unshareResponseSchema.parse(result);
    res.json(payload);
  });

  // ==================== Favorite Operations (Auth Required) ====================

  /**
   * POST /hub/themes/:id/favorite - Favorite a theme
   */
  router.post("/themes/:id/favorite", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    const result = hubService.favoriteTheme(activeProfile.id, req.params.id);
    if (!result) {
      res.status(400).json({ message: "Unable to favorite theme (already favorited or not found)" });
      return;
    }

    const payload = favoriteResponseSchema.parse(result);
    res.json(payload);
  });

  /**
   * DELETE /hub/themes/:id/favorite - Unfavorite a theme
   */
  router.delete("/themes/:id/favorite", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    const result = hubService.unfavoriteTheme(activeProfile.id, req.params.id);
    if (!result) {
      res.status(400).json({ message: "Unable to unfavorite theme (not favorited or not found)" });
      return;
    }

    const payload = unfavoriteResponseSchema.parse(result);
    res.json(payload);
  });

  /**
   * POST /hub/variations/:id/favorite - Favorite a variation
   */
  router.post("/variations/:id/favorite", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    const result = hubService.favoriteVariation(activeProfile.id, req.params.id);
    if (!result) {
      res.status(400).json({ message: "Unable to favorite variation (already favorited or not found)" });
      return;
    }

    const payload = favoriteResponseSchema.parse(result);
    res.json(payload);
  });

  /**
   * DELETE /hub/variations/:id/favorite - Unfavorite a variation
   */
  router.delete("/variations/:id/favorite", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    const result = hubService.unfavoriteVariation(activeProfile.id, req.params.id);
    if (!result) {
      res.status(400).json({ message: "Unable to unfavorite variation (not favorited or not found)" });
      return;
    }

    const payload = unfavoriteResponseSchema.parse(result);
    res.json(payload);
  });

  /**
   * GET /hub/favorites - Get user's favorites
   */
  router.get("/favorites", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    const payload = userFavoritesResponseSchema.parse(hubService.getUserFavorites(activeProfile.id));
    res.json(payload);
  });

  // ==================== Copy to Local Operations (Auth Required) ====================

  /**
   * POST /hub/themes/:id/copy - Copy a theme to local collection
   */
  router.post("/themes/:id/copy", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    try {
      const { customName } = req.body;
      const result = hubService.copyThemeToLocal(
        req.params.id,
        activeProfile.id, // userId (using profile id)
        activeProfile.id, // profileId
        customName
      );
      const payload = copyThemeToLocalResponseSchema.parse(result);
      res.status(201).json(payload);
    } catch (error) {
      res.status(404).json({ message: error instanceof Error ? error.message : "Unable to copy theme" });
    }
  });

  /**
   * POST /hub/variations/:id/copy - Copy a variation to local collection
   */
  router.post("/variations/:id/copy", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    try {
      const { customName } = req.body;
      const result = hubService.copyVariationToLocal(
        req.params.id,
        activeProfile.id,
        customName
      );
      const payload = copyVariationToLocalResponseSchema.parse(result);
      res.status(201).json(payload);
    } catch (error) {
      res.status(404).json({ message: error instanceof Error ? error.message : "Unable to copy variation" });
    }
  });

  return router;
};