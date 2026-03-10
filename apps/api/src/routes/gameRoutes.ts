import { Router } from "express";
import {
  gameSettingsSchema,
  highScoreResponseSchema,
  leaderboardResponseSchema,
  ProfileSchema,
  recentRunsResponseSchema,
  runRecordInputSchema,
  runRecordSchema
} from "@snake/contracts";
import { gameDataService } from "../services/gameDataService";

const asNumber = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const gameRouter = Router();

gameRouter.get("/profile", (_req, res) => {
  const payload = ProfileSchema.parse(gameDataService.getProfile());
  res.json(payload);
});

gameRouter.get("/scores/high", (_req, res) => {
  const payload = highScoreResponseSchema.parse(gameDataService.getHighScore());
  res.json(payload);
});

gameRouter.get("/leaderboard", (req, res) => {
  const limit = asNumber(req.query.limit, 10);
  const payload = leaderboardResponseSchema.parse(gameDataService.getLeaderboard(limit));
  res.json(payload);
});

gameRouter.post("/runs", (req, res) => {
  const parsedBody = runRecordInputSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ message: "Invalid run payload" });
    return;
  }

  const saved = runRecordSchema.parse(gameDataService.saveRun(parsedBody.data));
  res.status(201).json(saved);
});

gameRouter.get("/runs", (req, res) => {
  const limit = asNumber(req.query.limit, 20);
  const payload = recentRunsResponseSchema.parse(gameDataService.listRecentRuns(limit));
  res.json(payload);
});

gameRouter.get("/settings", (_req, res) => {
  const payload = gameSettingsSchema.parse(gameDataService.getSettings());
  res.json(payload);
});

gameRouter.put("/settings", (req, res) => {
  const parsedBody = gameSettingsSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ message: "Invalid settings payload" });
    return;
  }

  const payload = gameSettingsSchema.parse(gameDataService.saveSettings(parsedBody.data));
  res.json(payload);
});
