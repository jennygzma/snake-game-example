import { Router } from "express";
import type { Database } from "better-sqlite3";
import {
  createProfileInputSchema,
  updateProfileInputSchema,
  profilesListResponseSchema,
  profileResponseSchema,
  activeProfileResponseSchema
} from "@snake/contracts";
import { createProfileDataService } from "../services/profileDataService";

export const createProfileRouter = (db: Database) => {
  const profileService = createProfileDataService(db);
  const router = Router();

  /**
   * GET /profiles - List all profiles
   */
  router.get("/", (_req, res) => {
    const payload = profilesListResponseSchema.parse(profileService.listProfiles());
    res.json(payload);
  });

  /**
   * GET /profiles/active - Get the currently active profile
   */
  router.get("/active", (_req, res) => {
    const payload = activeProfileResponseSchema.parse(profileService.getActiveProfile());
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
    const payload = profileResponseSchema.parse(result);
    res.json(payload);
  });

  /**
   * POST /profiles - Create a new profile
   * First profile is automatically activated
   */
  router.post("/", (req, res) => {
    const parsedBody = createProfileInputSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ message: "Invalid profile payload", errors: parsedBody.error.errors });
      return;
    }

    const payload = profileResponseSchema.parse(profileService.createProfile(parsedBody.data));
    res.status(201).json(payload);
  });

  /**
   * PUT /profiles/:id - Update an existing profile
   */
  router.put("/:id", (req, res) => {
    const parsedBody = updateProfileInputSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ message: "Invalid profile payload", errors: parsedBody.error.errors });
      return;
    }

    const result = profileService.updateProfile(req.params.id, parsedBody.data);
    if (!result) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    const payload = profileResponseSchema.parse(result);
    res.json(payload);
  });

  /**
   * DELETE /profiles/:id - Delete a profile
   * CASCADE will delete all associated themes and game runs
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
   * Deactivates all other profiles
   */
  router.post("/:id/activate", (req, res) => {
    const result = profileService.activateProfile(req.params.id);
    if (!result) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    const payload = profileResponseSchema.parse(result);
    res.json(payload);
  });

  return router;
};