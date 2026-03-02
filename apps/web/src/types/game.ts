export type Direction = "up" | "down" | "left" | "right";

export type GameStatus = "idle" | "running" | "paused" | "game-over";

export type Cell = {
  x: number;
  y: number;
};

export type GameState = {
  snake: Cell[];
  food: Cell;
  direction: Direction;
  pendingDirection: Direction;
  score: number;
  status: GameStatus;
  tickCount: number;
};
