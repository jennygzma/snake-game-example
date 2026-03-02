import type { GameSettings } from "@snake/contracts";
import type { Cell, Direction, GameState } from "../types/game";
import { collidesWithSnake } from "./collision";
import { isInBounds, isSameCell, randomCell } from "./grid";

const START_LENGTH = 3;

const directionDelta: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

const oppositeDirection: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left"
};

const placeFood = (snake: Cell[], gridSize: number): Cell => {
  let next = randomCell(gridSize);
  while (collidesWithSnake(next, snake)) {
    next = randomCell(gridSize);
  }
  return next;
};

export const createInitialState = (settings: GameSettings): GameState => {
  const mid = Math.floor(settings.gridSize / 2);
  const snake: Cell[] = Array.from({ length: START_LENGTH }, (_, index) => ({
    x: mid - index,
    y: mid
  }));

  return {
    snake,
    food: placeFood(snake, settings.gridSize),
    direction: "right",
    pendingDirection: "right",
    score: 0,
    status: "idle",
    tickCount: 0
  };
};

export const setDirection = (state: GameState, direction: Direction): GameState => {
  if (oppositeDirection[state.direction] === direction) {
    return state;
  }

  return {
    ...state,
    pendingDirection: direction
  };
};

export const stepGame = (state: GameState, settings: GameSettings): GameState => {
  if (state.status !== "running") return state;

  const direction =
    oppositeDirection[state.direction] === state.pendingDirection
      ? state.direction
      : state.pendingDirection;

  const head = state.snake[0];
  if (!head) {
    return { ...state, status: "game-over" };
  }

  const delta = directionDelta[direction];
  const nextHead: Cell = { x: head.x + delta.x, y: head.y + delta.y };

  const bodyWithoutTail = state.snake.slice(0, -1);
  const hitsWall = !isInBounds(nextHead, settings.gridSize);
  const hitsSelf = collidesWithSnake(nextHead, bodyWithoutTail);

  if (hitsWall || hitsSelf) {
    return {
      ...state,
      direction,
      status: "game-over"
    };
  }

  const ateFood = isSameCell(nextHead, state.food);
  const snake = ateFood
    ? [nextHead, ...state.snake]
    : [nextHead, ...state.snake.slice(0, state.snake.length - 1)];

  return {
    ...state,
    snake,
    food: ateFood ? placeFood(snake, settings.gridSize) : state.food,
    direction,
    pendingDirection: direction,
    score: ateFood ? state.score + 1 : state.score,
    tickCount: state.tickCount + 1
  };
};
