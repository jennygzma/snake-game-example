import { Router } from "express";
import type { Database } from "better-sqlite3";
import {
  CreateProfileInputSchema,
  UpdateProfileInputSchema,
  ProfilesListResponseSchema,
  ProfileResponseSchema,
  ActiveProfileResponseSchema
} from "@snake/contracts";
import { createProfileDataService } from "../services/profileDataService";

export const createProfileRouter = (db: Database) => {
  const profileService = createProfileDataService(db);
  const router = Router();

  /**
   * GET /profiles - List all profiles
   */
  router.get("/", (_req, res) => {
    const payload = ProfilesListResponseSchema.parse(profileService.listProfiles());
    res.json(payload);
  });

  /**
   * GET /profiles/active - Get the currently active profile
   */
  router.get("/active", (_req, res) => {
    const payload = ActiveProfileResponseSchema.parse(profileService.getActiveProfile());
    res.json(payload);
  });

  /**
   * GET /profiles/:id - Get a specific profile by ID
   */
  router.get("/:id", (req, res) => {
    const result = profileService.getProfile(req.params.id);
    if (!result) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }
    const payload = ProfileResponseSchema.parse(result);
    res.json(payload);
  });

  /**
   * POST /profiles - Create a new profile
   * Note: If this is the first profile, it will be auto-activated
   */
  router.post("/", (req, res) => {
    const parsedBody = CreateProfileInputSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ message: "Invalid profile payload", errors: parsedBody.error.errors });
      return;
    }

    const payload = ProfileResponseSchema.parse(profileService.createProfile(parsedBody.data));
    res.status(201).json(payload);
  });

  /**
   * PUT /profiles/:id - Update an existing profile
   */
  router.put("/:id", (req, res) => {
    const parsedBody = UpdateProfileInputSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ message: "Invalid profile payload", errors: parsedBody.error.errors });
      return;
    }

    const result = profileService.updateProfile(req.params.id, parsedBody.data);
    if (!result) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    const payload = ProfileResponseSchema.parse(result);
    res.json(payload);
  });

  /**
   * DELETE /profiles/:id - Delete a profile
   * Warning: This will CASCADE delete all themes and game runs for this profile
   */
  router.delete("/:id", (req, res) => {
    const success = profileService.deleteProfile(req.params.id);
    if (!success) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }
    res.status(204).send();
  });

  /**
   * POST /profiles/:id/activate - Set a profile as active
   */
  router.post("/:id/activate", (req, res) => {
    const result = profileService.activateProfile(req.params.id);
    if (!result) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    const payload = ProfileResponseSchema.parse(result);
    res.json(payload);
  });

  return router;
};