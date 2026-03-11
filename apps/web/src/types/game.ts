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
  image?: string;
};

export type ActiveEffect = {
  powerupId: string;
  effect: "speed_increase" | "speed_decrease" | "add_blocks" | "subtract_blocks";
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
};
