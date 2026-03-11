export type Direction = "up" | "down" | "left" | "right";

export type GameStatus = "idle" | "running" | "paused" | "game-over";

export type Cell = {
  x: number;
  y: number;
};

export type PowerupEffect = 
  | "speed_increase"
  | "speed_decrease" 
  | "points_multiplier"
  | "length_increase"
  | "length_decrease";

export type FoodItem = {
  position: Cell;
  powerupId: string;
  effect: PowerupEffect;
  value: number;
  color: string;
  image?: string;
};

export type ActiveEffect = {
  powerupId: string;
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
  baseSpeed: number;
  currentSpeed: number;
};
