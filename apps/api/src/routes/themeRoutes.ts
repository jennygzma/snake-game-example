import { Router } from "express";
import {
  saveThemeInputSchema,
  themeResponseSchema,
  themesListResponseSchema,
  activeThemeResponseSchema
} from "@snake/contracts";
import { themeDataService } from "../services/themeDataService";

// Hardcoded user ID (no auth system)
const USER_ID = "dev-user-1";

export const themeRouter = Router();

// GET /themes - List all themes
themeRouter.get("/", (_req, res) => {
  const payload = themesListResponseSchema.parse(themeDataService.getAllThemes(USER_ID));
  res.json(payload);
});

// GET /themes/active - Get active theme
themeRouter.get("/active", (_req, res) => {
  const payload = activeThemeResponseSchema.parse(themeDataService.getActiveTheme(USER_ID));
  res.json(payload);
});

// GET /themes/:id - Get one theme
themeRouter.get("/:id", (req, res) => {
  const result = themeDataService.getThemeById(req.params.id, USER_ID);
  if (!result) {
    res.status(404).json({ message: "Theme not found" });
    return;
  }
  const payload = themeResponseSchema.parse(result);
  res.json(payload);
});

// POST /themes - Create theme
themeRouter.post("/", (req, res) => {
  const parsedBody = saveThemeInputSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ message: "Invalid theme payload", errors: parsedBody.error.errors });
    return;
  }

  const result = themeDataService.createTheme(USER_ID, parsedBody.data);
  const payload = themeResponseSchema.parse(result);
  res.status(201).json(payload);
});

// PUT /themes/:id - Update theme
themeRouter.put("/:id", (req, res) => {
  const parsedBody = saveThemeInputSchema.partial().safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ message: "Invalid theme payload", errors: parsedBody.error.errors });
    return;
  }

  const result = themeDataService.updateTheme(req.params.id, USER_ID, parsedBody.data);
  if (!result) {
    res.status(404).json({ message: "Theme not found" });
    return;
  }

  const payload = themeResponseSchema.parse(result);
  res.json(payload);
});

// DELETE /themes/:id - Delete theme
themeRouter.delete("/:id", (req, res) => {
  const success = themeDataService.deleteTheme(req.params.id, USER_ID);
  if (!success) {
    res.status(404).json({ message: "Theme not found" });
    return;
  }
  res.status(204).send();
});

// POST /themes/:id/activate - Set as active theme
themeRouter.post("/:id/activate", (req, res) => {
  const success = themeDataService.setActiveTheme(req.params.id, USER_ID);
  if (!success) {
    res.status(404).json({ message: "Theme not found" });
    return;
  }
  
  const result = themeDataService.getThemeById(req.params.id, USER_ID);
  const payload = themeResponseSchema.parse(result);
  res.json(payload);
});