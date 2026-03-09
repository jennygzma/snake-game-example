import type { Database } from "better-sqlite3";
import express from "express";
import {
  createProfileInputSchema,
  updateProfileInputSchema,
  profilesListResponseSchema,
  profileResponseSchema,
  activeProfileResponseSchema
} from "@snake/contracts";
import { createProfileDataService } from "../services/profileDataService";

export const createProfileRouter = (db: Database) => {
  const router = express.Router();
  const profileDataService = createProfileDataService(db);

// GET /profiles - List all profiles
router.get("/", (req, res) => {
  try {
    const response = profileDataService.listProfiles();
    const validated = profilesListResponseSchema.parse(response);
    res.json(validated);
  } catch (error) {
    console.error("Error listing profiles:", error);
    res.status(500).json({ error: "Failed to list profiles" });
  }
});

// GET /profiles/active - Get active profile
router.get("/active", (req, res) => {
  try {
    const response = profileDataService.getActiveProfile();
    const validated = activeProfileResponseSchema.parse(response);
    res.json(validated);
  } catch (error) {
    console.error("Error getting active profile:", error);
    res.status(500).json({ error: "Failed to get active profile" });
  }
});

// GET /profiles/:id - Get one profile
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const response = profileDataService.getProfile(id);
    
    if (!response) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }
    
    const validated = profileResponseSchema.parse(response);
    res.json(validated);
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
});

// POST /profiles - Create profile
router.post("/", (req, res) => {
  try {
    const input = createProfileInputSchema.parse(req.body);
    const response = profileDataService.createProfile(input);
    const validated = profileResponseSchema.parse(response);
    res.status(201).json(validated);
  } catch (error) {
    console.error("Error creating profile:", error);
    if (error instanceof Error && error.message.includes("parse")) {
      res.status(400).json({ error: "Invalid input" });
    } else {
      res.status(500).json({ error: "Failed to create profile" });
    }
  }
});

// PUT /profiles/:id - Update profile
router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const input = updateProfileInputSchema.parse(req.body);
    const response = profileDataService.updateProfile(id, input);
    
    if (!response) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }
    
    const validated = profileResponseSchema.parse(response);
    res.json(validated);
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error instanceof Error && error.message.includes("parse")) {
      res.status(400).json({ error: "Invalid input" });
    } else {
      res.status(500).json({ error: "Failed to update profile" });
    }
  }
});

// DELETE /profiles/:id - Delete profile
router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const success = profileDataService.deleteProfile(id);
    
    if (!success) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }
    
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ error: "Failed to delete profile" });
  }
});

// POST /profiles/:id/activate - Activate profile
router.post("/:id/activate", (req, res) => {
  try {
    const { id } = req.params;
    const response = profileDataService.activateProfile(id);
    
    if (!response) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }
    
    const validated = profileResponseSchema.parse(response);
    res.json(validated);
  } catch (error) {
    console.error("Error activating profile:", error);
    res.status(500).json({ error: "Failed to activate profile" });
  }
});

  return router;
};
