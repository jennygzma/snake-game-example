import type { GameSettings, PowerupType } from "@snake/contracts";
import type { Cell, Direction, GameState, FoodItem, ActiveEffect, PowerupEffect } from "../types/game";
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

const placeFood = (
  snake: Cell[],
  existingFoods: FoodItem[],
  gridSize: number,
  powerup: PowerupType
): FoodItem => {
  let position = randomCell(gridSize);
  const occupiedCells = [
    ...snake,
    ...existingFoods.map((f) => f.position)
  ];
  
  while (occupiedCells.some((cell) => isSameCell(cell, position))) {
    position = randomCell(gridSize);
  }
  
  return {
    position,
    powerupId: powerup.id,
    effect: powerup.effect as PowerupEffect,
    value: powerup.value,
    color: powerup.color,
    image: powerup.image
  };
};

const calculateSpeed = (baseSpeed: number, effects: ActiveEffect[]): number => {
  let speed = baseSpeed;
  
  for (const effect of effects) {
    if (effect.effect === "speed_increase") {
      speed *= effect.value;
    } else if (effect.effect === "speed_decrease") {
      speed *= effect.value;
    }
  }
  
  return Math.max(1, Math.min(30, Math.round(speed)));
};

export const createInitialState = (
  settings: GameSettings,
  powerups: PowerupType[] = [],
  maxConcurrentFoods: number = 1
): GameState => {
  const mid = Math.floor(settings.gridSize / 2);
  const snake: Cell[] = Array.from({ length: START_LENGTH }, (_, index) => ({
    x: mid - index,
    y: mid
  }));

  // Default powerup if none provided
  const defaultPowerup: PowerupType = {
    id: "default",
    effect: "points_multiplier",
    value: 1,
    color: "#87ae73"
  };

  const powerupList = powerups.length > 0 ? powerups : [defaultPowerup];
  
  // Spawn initial foods
  const foods: FoodItem[] = [];
  for (let i = 0; i < maxConcurrentFoods; i++) {
    const randomPowerup = powerupList[Math.floor(Math.random() * powerupList.length)];
    if (randomPowerup) {
      foods.push(placeFood(snake, foods, settings.gridSize, randomPowerup));
    }
  }

  const baseSpeed = settings.speed;

  return {
    snake,
    foods,
    direction: "right",
    pendingDirection: "right",
    score: 0,
    status: "idle",
    tickCount: 0,
    activeEffects: [],
    baseSpeed,
    currentSpeed: baseSpeed
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

export const stepGame = (
  state: GameState,
  settings: GameSettings,
  powerups: PowerupType[] = [],
  maxConcurrentFoods: number = 1
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

  // Check if any food was eaten
  const eatenFood = state.foods.find((food) => isSameCell(nextHead, food.position));
  
  let newSnake = state.snake;
  let newScore = state.score;
  let newFoods = state.foods;
  let newActiveEffects = [...state.activeEffects];

  if (eatenFood) {
    // Apply powerup effect
    const effect = eatenFood.effect;
    const value = eatenFood.value;

    if (effect === "points_multiplier") {
      newScore += Math.round(value);
    } else if (effect === "length_increase") {
      // Add extra segments
      const tail = state.snake[state.snake.length - 1];
      if (tail) {
        for (let i = 0; i < value; i++) {
          newSnake = [...newSnake, tail];
        }
      }
      newSnake = [nextHead, ...newSnake];
    } else if (effect === "length_decrease") {
      // Remove segments (but keep at least 1)
      const removeCount = Math.min(value, state.snake.length - 1);
      newSnake = [nextHead, ...state.snake.slice(0, Math.max(1, state.snake.length - removeCount))];
    } else if (effect === "speed_increase" || effect === "speed_decrease") {
      // Add permanent speed effect
      newActiveEffects.push({
        powerupId: eatenFood.powerupId,
        effect,
        value
      });
      newSnake = [nextHead, ...newSnake];
    } else {
      // Default: grow snake by 1
      newSnake = [nextHead, ...newSnake];
    }

    // Remove eaten food and spawn new one
    newFoods = state.foods.filter((f) => f !== eatenFood);
    
    const powerupList = powerups.length > 0 ? powerups : [{
      id: "default",
      effect: "points_multiplier",
      value: 1,
      color: "#87ae73"
    }] as PowerupType[];
    
    const randomPowerup = powerupList[Math.floor(Math.random() * powerupList.length)];
    if (randomPowerup && newFoods.length < maxConcurrentFoods) {
      newFoods.push(placeFood(newSnake, newFoods, settings.gridSize, randomPowerup));
    }
  } else {
    // No food eaten, move snake normally
    newSnake = [nextHead, ...state.snake.slice(0, state.snake.length - 1)];
  }

  // Calculate current speed based on active effects
  const currentSpeed = calculateSpeed(state.baseSpeed, newActiveEffects);

  return {
    ...state,
    snake: newSnake,
    foods: newFoods,
    direction,
    pendingDirection: direction,
    score: newScore,
    tickCount: state.tickCount + 1,
    activeEffects: newActiveEffects,
    currentSpeed
  };
};