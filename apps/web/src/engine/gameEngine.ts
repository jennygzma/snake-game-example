import type { GameSettings, PowerupType } from "@snake/contracts";
import type { Cell, Direction, GameState, FoodItem, ActiveEffect, PowerupEffect } from "../types/game";
import { collidesWithSnake } from "./collision";
import { isInBounds, isSameCell, randomCell } from "./grid";

// Game events for accessibility announcements
export type GameEvent = 
  | { type: "food_eaten"; effect: PowerupEffect; value: number }
  | { type: "speed_changed"; newSpeed: number }
  | { type: "blocks_added"; count: number }
  | { type: "blocks_removed"; count: number }
  | { type: "score_increased"; points: number };

export type GameEventListener = (event: GameEvent) => void;

const eventListeners: GameEventListener[] = [];

export const addGameEventListener = (listener: GameEventListener): (() => void) => {
  eventListeners.push(listener);
  return () => {
    const index = eventListeners.indexOf(listener);
    if (index > -1) {
      eventListeners.splice(index, 1);
    }
  };
};

const emitGameEvent = (event: GameEvent): void => {
  eventListeners.forEach(listener => listener(event));
};

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

const placeFood = (snake: Cell[], existingFoods: FoodItem[], gridSize: number, powerupTypes: PowerupType[]): FoodItem => {
  const existingPositions = [...snake, ...existingFoods.map(f => f.position)];
  let next = randomCell(gridSize);
  while (existingPositions.some(pos => isSameCell(pos, next))) {
    next = randomCell(gridSize);
  }

  // Randomly select a powerup type
  const powerup = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
  if (!powerup) {
    throw new Error("No powerup types available");
  }

  return {
    position: next,
    effect: powerup.effect,
    value: powerup.value,
    color: powerup.color
  };
};

const calculateSpeed = (baseSpeed: number, activeEffects: ActiveEffect[]): number => {
  let speed = baseSpeed;
  
  for (const effect of activeEffects) {
    if (effect.effect === "speed_increase") {
      speed += effect.value;
    } else if (effect.effect === "speed_decrease") {
      speed = Math.max(1, speed - effect.value);
    }
  }
  
  return speed;
};

export const createInitialState = (
  settings: GameSettings,
  powerupTypes: PowerupType[],
  maxConcurrentFoods: number
): GameState => {
  const mid = Math.floor(settings.gridSize / 2);
  const snake: Cell[] = Array.from({ length: START_LENGTH }, (_, index) => ({
    x: mid - index,
    y: mid
  }));

  const baseSpeed = settings.speed;
  const foods: FoodItem[] = [];
  
  // Spawn initial foods
  for (let i = 0; i < maxConcurrentFoods; i++) {
    foods.push(placeFood(snake, foods, settings.gridSize, powerupTypes));
  }

  return {
    snake,
    foods,
    direction: "right",
    pendingDirection: "right",
    score: 0,
    status: "idle",
    tickCount: 0,
    activeEffects: [],
    currentSpeed: baseSpeed,
    baseSpeed
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

const applyEffect = (
  state: GameState,
  effect: PowerupEffect,
  value: number,
  settings: GameSettings
): GameState => {
  let newSnake = state.snake;
  let newScore = state.score;
  let newActiveEffects = [...state.activeEffects];

  // Emit event for food eaten
  emitGameEvent({ type: "food_eaten", effect, value });

  switch (effect) {
    case "speed_increase":
    case "speed_decrease":
      // Add to permanent effects
      newActiveEffects.push({ effect, value });
      break;
    
    case "add_blocks":
      // Add blocks immediately to the tail
      for (let i = 0; i < value; i++) {
        const tail = newSnake[newSnake.length - 1];
        if (tail) {
          newSnake = [...newSnake, { ...tail }];
        }
      }
      emitGameEvent({ type: "blocks_added", count: value });
      break;
    
    case "subtract_blocks":
      // Remove blocks from tail (but keep at least 1)
      const blocksToRemove = Math.min(value, newSnake.length - 1);
      newSnake = newSnake.slice(0, newSnake.length - blocksToRemove);
      emitGameEvent({ type: "blocks_removed", count: blocksToRemove });
      break;
    
    case "double_points":
      newScore += value;
      emitGameEvent({ type: "score_increased", points: value });
      break;
  }

  const oldSpeed = state.currentSpeed;
  const newSpeed = calculateSpeed(state.baseSpeed, newActiveEffects);
  
  if (newSpeed !== oldSpeed) {
    emitGameEvent({ type: "speed_changed", newSpeed });
  }

  return {
    ...state,
    snake: newSnake,
    score: newScore,
    activeEffects: newActiveEffects,
    currentSpeed: newSpeed
  };
};

export const stepGame = (
  state: GameState,
  settings: GameSettings,
  powerupTypes: PowerupType[],
  maxConcurrentFoods: number
): GameState => {
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

  // Check if ate any food
  const eatenFoodIndex = state.foods.findIndex(food => isSameCell(nextHead, food.position));
  const ateFood = eatenFoodIndex !== -1;
  const eatenFood = ateFood ? state.foods[eatenFoodIndex] : null;

  // Update snake (grow if ate food)
  const snake = ateFood
    ? [nextHead, ...state.snake]
    : [nextHead, ...state.snake.slice(0, state.snake.length - 1)];

  // Apply effect if food was eaten
  let newState = {
    ...state,
    snake,
    direction,
    pendingDirection: direction,
    tickCount: state.tickCount + 1
  };

  if (ateFood && eatenFood) {
    newState = applyEffect(newState, eatenFood.effect, eatenFood.value, settings);
  }

  // Update foods
  let newFoods = [...state.foods];
  if (ateFood) {
    // Remove eaten food
    newFoods.splice(eatenFoodIndex, 1);
    // Spawn new food to maintain maxConcurrentFoods
    newFoods.push(placeFood(snake, newFoods, settings.gridSize, powerupTypes));
  }

  return {
    ...newState,
    foods: newFoods
  };
};