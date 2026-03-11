import type { PowerupEffect as ContractPowerupEffect } from "@snake/contracts";

export type PowerupEffect = ContractPowerupEffect;

export type Direction = "up" | "down" | "left" | "right";

export type GameStatus = "idle" | "running" | "paused" | "game-over";

export type Cell = {
  x: number;
  y: number;
};

export type FoodItem = {
  position: Cell;
  effect: PowerupEffect;
  value: number;
  color: string;
};

export type ActiveEffect = {
  effect: PowerupEffect;
  value: number;
};

export type GameState = {
  snake: Cell[];
  foods: FoodItem[];
  direction: Direction;
  pendingDirection: Direction;
  score: number;
  status: GameStatus;
  tickCount: number;
  activeEffects: ActiveEffect[];
  currentSpeed: number;
  baseSpeed: number;
};