import { Router } from "express";
import {
  activeThemeResponseSchema,
  createThemeInputSchema,
  customThemeSchema,
  themeListResponseSchema,
  updateThemeInputSchema
} from "@snake/contracts";
import { themeDataService } from "../services/themeDataService";

export const themeRouter = Router();

// GET /themes - List all themes
themeRouter.get("/themes", (_req, res) => {
  try {
    const response = themeDataService.getAllThemes();
    const validated = themeListResponseSchema.parse(response);
    res.json(validated);
  } catch (error) {
    console.error("Error listing themes:", error);
    res.status(500).json({ error: "Failed to list themes" });
  }
});

// GET /themes/active - Get active theme
themeRouter.get("/themes/active", (_req, res) => {
  try {
    const response = themeDataService.getActiveTheme();
    const validated = activeThemeResponseSchema.parse(response);
    res.json(validated);
  } catch (error) {
    console.error("Error getting active theme:", error);
    res.status(500).json({ error: "Failed to get active theme" });
  }
});

// GET /themes/:id - Get specific theme
themeRouter.get("/themes/:id", (req, res) => {
  try {
    const theme = themeDataService.getTheme(req.params.id);
    if (!theme) {
      res.status(404).json({ error: "Theme not found" });
      return;
    }
    const validated = customThemeSchema.parse(theme);
    res.json(validated);
  } catch (error) {
    console.error("Error getting theme:", error);
    res.status(500).json({ error: "Failed to get theme" });
  }
});

// POST /themes - Create new theme
themeRouter.post("/themes", (req, res) => {
  try {
    const input = createThemeInputSchema.parse(req.body);
    const theme = themeDataService.createTheme(input);
    const validated = customThemeSchema.parse(theme);
    res.status(201).json(validated);
  } catch (error) {
    console.error("Error creating theme:", error);
    if (error instanceof Error && "issues" in error) {
      res.status(400).json({ error: "Invalid theme data", details: error });
    } else {
      res.status(500).json({ error: "Failed to create theme" });
    }
  }
});

// PUT /themes/:id - Update theme
themeRouter.put("/themes/:id", (req, res) => {
  try {
    const input = updateThemeInputSchema.parse(req.body);
    const theme = themeDataService.updateTheme(req.params.id, input);
    if (!theme) {
      res.status(404).json({ error: "Theme not found" });
      return;
    }
    const validated = customThemeSchema.parse(theme);
    res.json(validated);
  } catch (error) {
    console.error("Error updating theme:", error);
    if (error instanceof Error && "issues" in error) {
      res.status(400).json({ error: "Invalid theme data", details: error });
    } else {
      res.status(500).json({ error: "Failed to update theme" });
    }
  }
});

// DELETE /themes/:id - Delete theme
themeRouter.delete("/themes/:id", (req, res) => {
  try {
    const success = themeDataService.deleteTheme(req.params.id);
    if (!success) {
      res.status(404).json({ error: "Theme not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting theme:", error);
    res.status(500).json({ error: "Failed to delete theme" });
  }
});

// POST /themes/:id/activate - Set theme as active
themeRouter.post("/themes/:id/activate", (req, res) => {
  try {
    const theme = themeDataService.activateTheme(req.params.id);
    if (!theme) {
      res.status(404).json({ error: "Theme not found" });
      return;
    }
    const validated = customThemeSchema.parse(theme);
    res.json(validated);
  } catch (error) {
    console.error("Error activating theme:", error);
    res.status(500).json({ error: "Failed to activate theme" });
  }
});