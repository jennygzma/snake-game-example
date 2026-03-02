import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_SETTINGS,
  type GameSettings,
  type LeaderboardEntry,
  type Profile
} from "@snake/contracts";
import { createInitialState, setDirection, stepGame } from "../engine/gameEngine";
import { useGameLoop } from "./useGameLoop";
import type { Direction, GameState } from "../types/game";
import type { GameService } from "../services/gameService";

type UseGameResult = {
  game: GameState;
  settings: GameSettings;
  player: Profile | null;
  highScore: number;
  leaderboard: LeaderboardEntry[];
  error: string | null;
  startGame: () => void;
  resetGame: () => void;
  togglePause: () => void;
  turn: (direction: Direction) => void;
};

export const useGame = (service: GameService): UseGameResult => {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [game, setGame] = useState<GameState>(() => createInitialState(DEFAULT_SETTINGS));
  const [player, setPlayer] = useState<Profile | null>(null);
  const [highScore, setHighScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const runStartRef = useRef<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [profile, highScoreResponse, loadedSettings, leaderboardResponse] = await Promise.all([
          service.getProfile(),
          service.getHighScore(),
          service.getSettings(),
          service.getLeaderboard(10)
        ]);

        setPlayer(profile);
        setHighScore(highScoreResponse.highScore);
        setLeaderboard(leaderboardResponse.entries);
        setSettings(loadedSettings);
        setGame(createInitialState(loadedSettings));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load game";
        setError(message);
      }
    };

    void load();
  }, [service]);

  const turn = useCallback((direction: Direction) => {
    setGame((current) => setDirection(current, direction));
  }, []);

  const startGame = useCallback(() => {
    setGame((current) => {
      if (current.status === "running") return current;
      if (current.status === "game-over") {
        runStartRef.current = Date.now();
        return {
          ...createInitialState(settings),
          status: "running"
        };
      }
      runStartRef.current = Date.now();
      return { ...current, status: "running" };
    });
  }, [settings]);

  const togglePause = useCallback(() => {
    setGame((current) => {
      if (current.status === "running") return { ...current, status: "paused" };
      if (current.status === "paused") return { ...current, status: "running" };
      return current;
    });
  }, []);

  const resetGame = useCallback(() => {
    runStartRef.current = null;
    setGame(createInitialState(settings));
  }, [settings]);

  const onTick = useCallback(() => {
    setGame((current) => stepGame(current, settings));
  }, [settings]);

  useGameLoop({
    enabled: game.status === "running",
    ticksPerSecond: settings.speed,
    onTick
  });

  useEffect(() => {
    if (game.status !== "game-over") return;

    const persist = async () => {
      try {
        const durationMs = runStartRef.current ? Date.now() - runStartRef.current : 0;
        await service.saveRun({
          score: game.score,
          durationMs,
          endedAt: new Date().toISOString()
        });

        setHighScore((current) => Math.max(current, game.score));
        const leaderboardResponse = await service.getLeaderboard(10);
        setLeaderboard(leaderboardResponse.entries);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save score";
        setError(message);
      }
    };

    void persist();
  }, [game.score, game.status, service]);

  const result = useMemo(
    () => ({
      game,
      settings,
      player,
      highScore,
      leaderboard,
      error,
      startGame,
      resetGame,
      togglePause,
      turn
    }),
    [error, game, highScore, leaderboard, player, resetGame, settings, startGame, togglePause, turn]
  );

  return result;
};
