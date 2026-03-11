export type Direction = "up" | "down" | "left" | "right";

export type GameStatus = "idle" | "running" | "paused" | "game-over";

export type Cell = {
  x: number;
  y: number;
};

export type FoodItem = {
  position: Cell;
  powerupId: string;
  color: string;
  imageBase64?: string;
};

export type ActiveEffect = {
  powerupId: string;
  effect: "speed_boost" | "speed_reduction" | "point_multiplier" | "length_add" | "length_subtract";
  value: number;
  appliedAt: number; // timestamp
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
  currentSpeed: number; // Calculated from base + effects
};
