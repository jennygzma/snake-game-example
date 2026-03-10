import { Router } from "express";
import type { Database } from "better-sqlite3";
import {
  saveThemeInputSchema,
  themesListResponseSchema,
  themeResponseSchema,
  activeThemeResponseSchema
} from "@snake/contracts";
import { createThemeDataService } from "../services/themeDataService";
import { profileQueries } from "../db/profileQueries";

export const createThemeRouter = (db: Database) => {
  const themeService = createThemeDataService(db);
  const profileQs = profileQueries(db);
  const router = Router();

  /**
   * GET /themes - List all themes for the active profile
   */
  router.get("/", (_req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(404).json({ message: "No active profile found" });
      return;
    }
    const payload = themesListResponseSchema.parse(themeService.listThemes(activeProfile.id));
    res.json(payload);
  });

  /**
   * GET /themes/:id - Get a specific theme by ID
   */
  router.get("/:id", (req, res) => {
    const result = themeService.getTheme(req.params.id);
    if (!result) {
      res.status(404).json({ message: "Theme not found" });
      return;
    }
    const payload = themeResponseSchema.parse(result);
    res.json(payload);
  });

  /**
   * GET /themes/active - Get the currently active theme for the active profile
   */
  router.get("/active/current", (_req, res) => {
    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(404).json({ message: "No active profile found" });
      return;
    }
    const payload = activeThemeResponseSchema.parse(themeService.getActiveTheme(activeProfile.id));
    res.json(payload);
  });

  /**
   * POST /themes - Create a new theme
   */
  router.post("/", (req, res) => {
    const parsedBody = saveThemeInputSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ message: "Invalid theme payload", errors: parsedBody.error.errors });
      return;
    }

    const activeProfile = profileQs.getActive();
    if (!activeProfile) {
      res.status(404).json({ message: "No active profile found" });
      return;
    }

    const payload = themeResponseSchema.parse(themeService.createTheme(activeProfile.id, parsedBody.data));
    res.status(201).json(payload);
  });

  /**
   * PUT /themes/:id - Update an existing theme
   */
  router.put("/:id", (req, res) => {
    const parsedBody = saveThemeInputSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ message: "Invalid theme payload", errors: parsedBody.error.errors });
      return;
    }

    const result = themeService.updateTheme(req.params.id, parsedBody.data);
    if (!result) {
      res.status(404).json({ message: "Theme not found" });
      return;
    }

    const payload = themeResponseSchema.parse(result);
    res.json(payload);
  });

  /**
   * DELETE /themes/:id - Delete a theme
   */
  router.delete("/:id", (req, res) => {
    const success = themeService.deleteTheme(req.params.id);
    if (!success) {
      res.status(404).json({ message: "Theme not found" });
      return;
    }
    res.status(204).send();
  });

  /**
   * POST /themes/:id/activate - Set a theme as active
   */
  router.post("/:id/activate", (req, res) => {
    const result = themeService.activateTheme(req.params.id);
    if (!result) {
      res.status(404).json({ message: "Theme not found" });
      return;
    }

    const payload = themeResponseSchema.parse(result);
    res.json(payload);
  });

  return router;
};
