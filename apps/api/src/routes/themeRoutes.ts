import { Router } from "express";
import {
  ActiveThemeResponseSchema,
  CustomThemeSchema,
  SaveThemeInputSchema,
  ThemeListResponseSchema,
  ThemeResponseSchema
} from "@snake/contracts";
import { themeDataService } from "../services/themeDataService";

export const themeRouter = Router();

// GET /themes - List all themes
themeRouter.get("/themes", (_req, res) => {
  const themes = themeDataService.listThemes();
  const payload = ThemeListResponseSchema.parse({ themes });
  res.json(payload);
});

// GET /themes/active - Get active theme
themeRouter.get("/themes/active", (_req, res) => {
  const theme = themeDataService.getActiveTheme();
  const payload = ActiveThemeResponseSchema.parse({ theme });
  res.json(payload);
});

// GET /themes/:id - Get one theme
themeRouter.get("/themes/:id", (req, res) => {
  const theme = themeDataService.getTheme(req.params.id);
  
  if (!theme) {
    res.status(404).json({ message: "Theme not found" });
    return;
  }

  const payload = ThemeResponseSchema.parse({ theme });
  res.json(payload);
});

// POST /themes - Create theme
themeRouter.post("/themes", (req, res) => {
  const parsedBody = SaveThemeInputSchema.safeParse(req.body);
  
  if (!parsedBody.success) {
    res.status(400).json({ message: "Invalid theme payload", errors: parsedBody.error.errors });
    return;
  }

  const theme = themeDataService.createTheme(parsedBody.data);
  const payload = ThemeResponseSchema.parse({ theme });
  res.status(201).json(payload);
});

// PUT /themes/:id - Update theme
themeRouter.put("/themes/:id", (req, res) => {
  const parsedBody = SaveThemeInputSchema.partial().safeParse(req.body);
  
  if (!parsedBody.success) {
    res.status(400).json({ message: "Invalid theme payload", errors: parsedBody.error.errors });
    return;
  }

  const theme = themeDataService.updateTheme(req.params.id, parsedBody.data);
  
  if (!theme) {
    res.status(404).json({ message: "Theme not found" });
    return;
  }

  const payload = ThemeResponseSchema.parse({ theme });
  res.json(payload);
});

// DELETE /themes/:id - Delete theme
themeRouter.delete("/themes/:id", (req, res) => {
  const success = themeDataService.deleteTheme(req.params.id);
  
  if (!success) {
    res.status(404).json({ message: "Theme not found or cannot delete active theme" });
    return;
  }

  res.status(204).send();
});

// POST /themes/:id/activate - Activate theme
themeRouter.post("/themes/:id/activate", (req, res) => {
  const theme = themeDataService.activateTheme(req.params.id);
  
  if (!theme) {
    res.status(404).json({ message: "Theme not found" });
    return;
  }

  const payload = ThemeResponseSchema.parse({ theme });
  res.json(payload);
});