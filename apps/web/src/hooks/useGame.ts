import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_SETTINGS,
  type GameVariation,
  type GameSettings,
  type LeaderboardEntry,
  type Profile,
  type PowerupType
} from "@snake/contracts";
import { createInitialState, setDirection, stepGame } from "../engine/gameEngine";
import { useGameLoop } from "./useGameLoop";
import type { Direction, GameState } from "../types/game";
import type { GameService } from "../services/gameService";
import { gameTokens } from "../theme/tokens";

const DEFAULT_POWERUPS: PowerupType[] = [
  { effect: "double_points", value: 2, color: gameTokens.colors.food }
];
const DEFAULT_MAX_CONCURRENT_FOODS = 1;

type UseGameResult = {
  game: GameState;
  settings: GameSettings;
  player: Profile | null;
  highScore: number;
  activeLeaderboard: LeaderboardEntry[];
  globalLeaderboard: LeaderboardEntry[];
  error: string | null;
  startGame: () => void;
  resetGame: () => void;
  togglePause: () => void;
  turn: (direction: Direction) => void;
};

const toEffectiveSettings = (settings: GameSettings, variation: GameVariation | null): GameSettings => {
  if (!variation) {
    return settings;
  }

  return {
    ...settings,
    speed: variation.baseSpeed,
    gridSize: variation.gridSize,
    variationId: variation.id
  };
};

export const useGame = (
  service: GameService,
  activeProfileId?: string,
  activeVariation?: GameVariation | null
): UseGameResult => {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [game, setGame] = useState<GameState>(() =>
    createInitialState(DEFAULT_SETTINGS, DEFAULT_POWERUPS, DEFAULT_MAX_CONCURRENT_FOODS)
  );
  const [player, setPlayer] = useState<Profile | null>(null);
  const [highScore, setHighScore] = useState(0);
  const [activeLeaderboard, setActiveLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const runStartRef = useRef<number | null>(null);
  const resolvedVariation = activeVariation ?? null;
  const effectiveSettings = useMemo(
    () => toEffectiveSettings(settings, resolvedVariation),
    [resolvedVariation, settings]
  );
  const activePowerups = resolvedVariation?.powerupTypes ?? DEFAULT_POWERUPS;
  const maxConcurrentFoods = resolvedVariation?.maxConcurrentFoods ?? DEFAULT_MAX_CONCURRENT_FOODS;

  useEffect(() => {
    const load = async () => {
      try {
        const [profile, highScoreResponse, loadedSettings, activeLeaderboardResponse, globalLeaderboardResponse] =
          await Promise.all([
            service.getProfile(),
            service.getHighScore(),
            service.getSettings(),
            service.getLeaderboard(10, "active"),
            service.getLeaderboard(10, "global")
          ]);

        setPlayer(profile);
        setHighScore(highScoreResponse.highScore);
        setActiveLeaderboard(activeLeaderboardResponse.entries);
        setGlobalLeaderboard(globalLeaderboardResponse.entries);
        setSettings(loadedSettings);
        setGame(
          createInitialState(
            toEffectiveSettings(loadedSettings, resolvedVariation),
            resolvedVariation?.powerupTypes ?? DEFAULT_POWERUPS,
            resolvedVariation?.maxConcurrentFoods ?? DEFAULT_MAX_CONCURRENT_FOODS
          )
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load game";
        setError(message);
      }
    };

    void load();
  }, [activeProfileId, service]);

  useEffect(() => {
    if (game.status === "running" || game.status === "paused") {
      return;
    }
    setGame(createInitialState(effectiveSettings, activePowerups, maxConcurrentFoods));
  }, [activePowerups, effectiveSettings, game.status, maxConcurrentFoods]);

  const turn = useCallback((direction: Direction) => {
    setGame((current) => setDirection(current, direction));
  }, []);

  const startGame = useCallback(() => {
    setGame((current) => {
      if (current.status === "running") return current;
      if (current.status === "game-over") {
        runStartRef.current = Date.now();
        return {
          ...createInitialState(effectiveSettings, activePowerups, maxConcurrentFoods),
          status: "running"
        };
      }
      runStartRef.current = Date.now();
      return { ...current, status: "running" };
    });
  }, [activePowerups, effectiveSettings, maxConcurrentFoods]);

  const togglePause = useCallback(() => {
    setGame((current) => {
      if (current.status === "running") return { ...current, status: "paused" };
      if (current.status === "paused") return { ...current, status: "running" };
      return current;
    });
  }, []);

  const resetGame = useCallback(() => {
    runStartRef.current = null;
    setGame(createInitialState(effectiveSettings, activePowerups, maxConcurrentFoods));
  }, [activePowerups, effectiveSettings, maxConcurrentFoods]);

  const onTick = useCallback(() => {
    setGame((current) => stepGame(current, effectiveSettings, activePowerups, maxConcurrentFoods));
  }, [activePowerups, effectiveSettings, maxConcurrentFoods]);

  useGameLoop({
    enabled: game.status === "running",
    ticksPerSecond: game.currentSpeed,
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
          endedAt: new Date().toISOString(),
          variationId: resolvedVariation?.id
        });

        setHighScore((current) => Math.max(current, game.score));
        const [activeLeaderboardResponse, globalLeaderboardResponse] = await Promise.all([
          service.getLeaderboard(10, "active"),
          service.getLeaderboard(10, "global")
        ]);
        setActiveLeaderboard(activeLeaderboardResponse.entries);
        setGlobalLeaderboard(globalLeaderboardResponse.entries);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save score";
        setError(message);
      }
    };

    void persist();
  }, [game.score, game.status, resolvedVariation?.id, service]);

  return useMemo(
    () => ({
      game,
      settings: effectiveSettings,
      player,
      highScore,
      activeLeaderboard,
      globalLeaderboard,
      error,
      startGame,
      resetGame,
      togglePause,
      turn
    }),
    [
      activeLeaderboard,
      error,
      game,
      globalLeaderboard,
      highScore,
      player,
      resetGame,
      effectiveSettings,
      startGame,
      togglePause,
      turn
    ]
  );
};
