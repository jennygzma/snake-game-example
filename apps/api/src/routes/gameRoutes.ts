import { Router, type Response } from "express";
import type { Database } from "better-sqlite3";
import {
  gameSettingsSchema,
  highScoreResponseSchema,
  leaderboardQuerySchema,
  leaderboardResponseSchema,
  profileSchema,
  recentRunsResponseSchema,
  runRecordInputSchema,
  runRecordSchema
} from "@snake/contracts";
import { createGameDataService } from "../services/gameDataService";

const asNumber = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const createGameRouter = (db: Database) => {
  const gameDataService = createGameDataService(db);
  const gameRouter = Router();
  const sendNoActiveProfile = (res: Response) => {
    res.status(404).json({ message: "No active profile found" });
  };

  gameRouter.get("/profile", (_req, res) => {
    try {
      const payload = profileSchema.parse(gameDataService.getProfile());
      res.json(payload);
    } catch (error) {
      if (error instanceof Error && error.message === "NO_ACTIVE_PROFILE") {
        res.status(404).json({ message: "No active profile found" });
        return;
      }
      throw error;
    }
  });

  gameRouter.get("/scores/high", (_req, res) => {
    try {
      const payload = highScoreResponseSchema.parse(gameDataService.getHighScore());
      res.json(payload);
    } catch (error) {
      if (error instanceof Error && error.message === "NO_ACTIVE_PROFILE") {
        sendNoActiveProfile(res);
        return;
      }
      throw error;
    }
  });

  gameRouter.get("/leaderboard", (req, res) => {
    try {
      const limit = asNumber(req.query.limit, 10);
      const scope = req.query.scope === "global" ? "global" : "active";
      const query = leaderboardQuerySchema.safeParse({ variationId: req.query.variationId });
      const payload = leaderboardResponseSchema.parse(
        gameDataService.getLeaderboard(limit, scope, query.success ? query.data : undefined)
      );
      res.json(payload);
    } catch (error) {
      if (error instanceof Error && error.message === "NO_ACTIVE_PROFILE") {
        sendNoActiveProfile(res);
        return;
      }
      throw error;
    }
  });

  gameRouter.post("/runs", (req, res) => {
    const parsedBody = runRecordInputSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ message: "Invalid run payload" });
      return;
    }

    try {
      const saved = runRecordSchema.parse(gameDataService.saveRun(parsedBody.data));
      res.status(201).json(saved);
    } catch (error) {
      if (error instanceof Error && error.message === "NO_ACTIVE_PROFILE") {
        sendNoActiveProfile(res);
        return;
      }
      throw error;
    }
  });

  gameRouter.get("/runs", (req, res) => {
    try {
      const limit = asNumber(req.query.limit, 20);
      const payload = recentRunsResponseSchema.parse(gameDataService.listRecentRuns(limit));
      res.json(payload);
    } catch (error) {
      if (error instanceof Error && error.message === "NO_ACTIVE_PROFILE") {
        sendNoActiveProfile(res);
        return;
      }
      throw error;
    }
  });

  gameRouter.get("/settings", (_req, res) => {
    try {
      const payload = gameSettingsSchema.parse(gameDataService.getSettings());
      res.json(payload);
    } catch (error) {
      if (error instanceof Error && error.message === "NO_ACTIVE_PROFILE") {
        sendNoActiveProfile(res);
        return;
      }
      throw error;
    }
  });

  gameRouter.put("/settings", (req, res) => {
    const parsedBody = gameSettingsSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ message: "Invalid settings payload" });
      return;
    }

    try {
      const payload = gameSettingsSchema.parse(gameDataService.saveSettings(parsedBody.data));
      res.json(payload);
    } catch (error) {
      if (error instanceof Error && error.message === "NO_ACTIVE_PROFILE") {
        sendNoActiveProfile(res);
        return;
      }
      throw error;
    }
  });

  return gameRouter;
};
