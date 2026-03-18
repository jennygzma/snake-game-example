import { Router } from "express";
import type { Database } from "better-sqlite3";
import {
  hubSearchParamsSchema,
  hubThemesResponseSchema,
  hubVariationsResponseSchema,
  hubThemeResponseSchema,
  hubVariationResponseSchema,
  shareThemeInputSchema,
  shareVariationInputSchema,
  shareResponseSchema,
  userFavoritesResponseSchema,
  copyToLocalResponseSchema
} from "@snake/contracts";
import { createHubDataService } from "../services/hubDataService";
import { profileQueries } from "../db/profileQueries";

export const createHubRouter = (db: Database) => {
  const hubService = createHubDataService(db);
  const profileQs = profileQueries(db);
  const router = Router();

  // ==================== PUBLIC BROWSE ROUTES ====================

  /**
   * GET /hub/themes - Browse shared themes (public)
   */
  router.get("/themes", (req, res) => {
    const params = hubSearchParamsSchema.parse({
      query: req.query.query,
      sortBy: req.query.sortBy || "newest",
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    });

    const payload = hubThemesResponseSchema.parse(hubService.browseThemes(params));
    res.json(payload);
  });

  /**
   * GET /hub/themes/:id - Get a single shared theme (public)
   */
  router.get("/themes/:id", (req, res) => {
    const result = hubService.getSharedTheme(req.params.id);
    if (!result) {
      res.status(404).json({ message: "Shared theme not found" });
      return;
    }
    const payload = hubThemeResponseSchema.parse(result);
    res.json(payload);
  });

  /**
   * GET /hub/variations - Browse shared variations (public)
   */
  router.get("/variations", (req, res) => {
    const params = hubSearchParamsSchema.parse({
      query: req.query.query,
      difficulty: req.query.difficulty,
      sortBy: req.query.sortBy || "newest",
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    });

    const payload = hubVariationsResponseSchema.parse(hubService.browseVariations(params));
    res.json(payload);
  });

  /**
   * GET /hub/variations/:id - Get a single shared variation (public)
   */
  router.get("/variations/:id", (req, res) => {
    const result = hubService.getSharedVariation(req.params.id);
    if (!result) {
      res.status(404).json({ message: "Shared variation not found" });
      return;
    }
    const payload = hubVariationResponseSchema.parse(result);
    res.json(payload);
  });

  // ==================== SHARE ROUTES (AUTH REQUIRED) ====================

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
      res.status(400).json({ message: "Invalid share payload", errors: parsedBody.error.errors });
      return;
    }

    try {
      const payload = shareResponseSchema.parse(
        hubService.shareTheme(parsedBody.data, activeProfile.id)
      );
      res.status(201).json(payload);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
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
      res.status(400).json({ message: "Invalid share payload", errors: parsedBody.error.errors });
      return;
    }

    try {
      const payload = shareResponseSchema.parse(
        hubService.shareVariation(parsedBody.data, activeProfile.id)
      );
      res.status(201).json(payload);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  /**
   * PUT /hub/themes/:id - Update shared theme description (creator only)
   */
  router.put("/themes/:id", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    const { description } = req.body;
    const success = hubService.updateSharedTheme(req.params.id, activeProfile.id, description);

    if (!success) {
      res.status(404).json({ message: "Shared theme not found or you don't have permission" });
      return;
    }

    res.json({ message: "Theme updated successfully" });
  });

  /**
   * PUT /hub/variations/:id - Update shared variation description (creator only)
   */
  router.put("/variations/:id", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    const { description } = req.body;
    const success = hubService.updateSharedVariation(req.params.id, activeProfile.id, description);

    if (!success) {
      res.status(404).json({ message: "Shared variation not found or you don't have permission" });
      return;
    }

    res.json({ message: "Variation updated successfully" });
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

    const success = hubService.unshareTheme(req.params.id, activeProfile.id);

    if (!success) {
      res.status(404).json({ message: "Shared theme not found or you don't have permission" });
      return;
    }

    res.status(204).send();
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

    const success = hubService.unshareVariation(req.params.id, activeProfile.id);

    if (!success) {
      res.status(404).json({ message: "Shared variation not found or you don't have permission" });
      return;
    }

    res.status(204).send();
  });

  // ==================== FAVORITE ROUTES (AUTH REQUIRED) ====================

  /**
   * POST /hub/themes/:id/favorite - Favorite a theme and create local copy
   */
  router.post("/themes/:id/favorite", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    try {
      const payload = copyToLocalResponseSchema.parse(
        hubService.favoriteTheme(req.params.id, activeProfile.id, activeProfile.id)
      );
      res.status(201).json(payload);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  /**
   * DELETE /hub/themes/:id/favorite - Unfavorite a theme (keeps local copy)
   */
  router.delete("/themes/:id/favorite", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    const success = hubService.unfavoriteTheme(req.params.id, activeProfile.id);

    if (!success) {
      res.status(404).json({ message: "Theme not favorited" });
      return;
    }

    res.status(204).send();
  });

  /**
   * POST /hub/variations/:id/favorite - Favorite a variation and create local copy
   */
  router.post("/variations/:id/favorite", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    try {
      const payload = copyToLocalResponseSchema.parse(
        hubService.favoriteVariation(req.params.id, activeProfile.id)
      );
      res.status(201).json(payload);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  /**
   * DELETE /hub/variations/:id/favorite - Unfavorite a variation (keeps local copy)
   */
  router.delete("/variations/:id/favorite", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    const success = hubService.unfavoriteVariation(req.params.id, activeProfile.id);

    if (!success) {
      res.status(404).json({ message: "Variation not favorited" });
      return;
    }

    res.status(204).send();
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

    const payload = userFavoritesResponseSchema.parse(
      hubService.getUserFavorites(activeProfile.id)
    );
    res.json(payload);
  });

  // ==================== COPY ROUTES (AUTH REQUIRED) ====================

  /**
   * POST /hub/themes/:id/copy - Copy a theme to local without favoriting
   */
  router.post("/themes/:id/copy", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    const { customName } = req.body;

    try {
      const payload = copyToLocalResponseSchema.parse(
        hubService.copyThemeToLocal(
          req.params.id,
          activeProfile.id,
          activeProfile.id,
          customName
        )
      );
      res.status(201).json(payload);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  /**
   * POST /hub/variations/:id/copy - Copy a variation to local without favoriting
   */
  router.post("/variations/:id/copy", (req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(401).json({ message: "No active profile found" });
      return;
    }

    const { customName } = req.body;

    try {
      const payload = copyToLocalResponseSchema.parse(
        hubService.copyVariationToLocal(req.params.id, activeProfile.id, customName)
      );
      res.status(201).json(payload);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  return router;
};