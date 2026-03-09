import { Router } from "express";
import {
  createProfileInputSchema,
  updateProfileInputSchema,
  profileResponseSchema,
  profilesListResponseSchema,
  activeProfileResponseSchema
} from "@snake/contracts";
import { profileDataService } from "../services/profileDataService";

export const profileRoutes = Router();

// GET /profiles - List all profiles
profileRoutes.get("/", (_req, res) => {
  const response = profileDataService.listProfiles();
  const parsed = profilesListResponseSchema.parse(response);
  res.json(parsed);
});

// GET /profiles/active - Get active profile
profileRoutes.get("/active", (_req, res) => {
  const response = profileDataService.getActiveProfile();
  const parsed = activeProfileResponseSchema.parse(response);
  res.json(parsed);
});

// GET /profiles/:id - Get specific profile
profileRoutes.get("/:id", (req, res) => {
  const { id } = req.params;
  const response = profileDataService.getProfile(id);
  
  if (!response) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  const parsed = profileResponseSchema.parse(response);
  res.json(parsed);
});

// POST /profiles - Create new profile
profileRoutes.post("/", (req, res) => {
  const input = createProfileInputSchema.parse(req.body);
  const response = profileDataService.createProfile(input);
  const parsed = profileResponseSchema.parse(response);
  res.status(201).json(parsed);
});

// PUT /profiles/:id - Update profile
profileRoutes.put("/:id", (req, res) => {
  const { id } = req.params;
  const input = updateProfileInputSchema.parse(req.body);
  const response = profileDataService.updateProfile(id, input);

  if (!response) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  const parsed = profileResponseSchema.parse(response);
  res.json(parsed);
});

// DELETE /profiles/:id - Delete profile
profileRoutes.delete("/:id", (req, res) => {
  const { id } = req.params;
  const success = profileDataService.deleteProfile(id);

  if (!success) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  res.status(204).send();
});

// POST /profiles/:id/activate - Activate profile
profileRoutes.post("/:id/activate", (req, res) => {
  const { id } = req.params;
  const response = profileDataService.activateProfile(id);

  if (!response) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  const parsed = profileResponseSchema.parse(response);
  res.json(parsed);
});