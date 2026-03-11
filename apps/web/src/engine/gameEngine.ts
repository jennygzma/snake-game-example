import type { GameSettings, GameVariation, PowerupType } from "@snake/contracts";
import type { Cell, Direction, GameState, FoodItem, ActiveEffect } from "../types/game";
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

const placeFoodItem = (snake: Cell[], gridSize: number, existingFoods: FoodItem[], powerup: PowerupType): FoodItem => {
  let position = randomCell(gridSize);
  const allOccupied = [...snake, ...existingFoods.map(f => f.position)];
  
  while (allOccupied.some(cell => isSameCell(cell, position))) {
    position = randomCell(gridSize);
  }
  
  return {
    position,
    powerupId: powerup.id,
    color: powerup.color,
    image: powerup.image
  };
};

const calculateCurrentSpeed = (baseSpeed: number, effects: ActiveEffect[]): number => {
  let speedMultiplier = 1;
  
  for (const effect of effects) {
    if (effect.effect === "speed_increase") {
      speedMultiplier *= effect.value;
    } else if (effect.effect === "speed_decrease") {
      speedMultiplier *= effect.value;
    }
  }
  
  return Math.max(1, Math.round(baseSpeed * speedMultiplier));
};

export const createInitialState = (settings: GameSettings, variation?: GameVariation): GameState => {
  const mid = Math.floor(settings.gridSize / 2);
  const snake: Cell[] = Array.from({ length: START_LENGTH }, (_, index) => ({
    x: mid - index,
    y: mid
  }));

  const foods: FoodItem[] = [];
  if (variation) {
    const maxFoods = Math.min(variation.maxConcurrentFoods, variation.enabledPowerups.length);
    for (let i = 0; i < maxFoods; i++) {
      const powerup = variation.enabledPowerups[i % variation.enabledPowerups.length];
      if (powerup) {
        foods.push(placeFoodItem(snake, settings.gridSize, foods, powerup));
      }
    }
  } else {
    // Default single food for classic mode
    const defaultPowerup: PowerupType = {
      id: "default-food",
      name: "Food",
      effect: "add_blocks",
      effectValue: 1,
      color: "#87ae73"
    };
    foods.push(placeFoodItem(snake, settings.gridSize, [], defaultPowerup));
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
    currentSpeed: variation?.baseSpeed || settings.speed
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

export const stepGame = (state: GameState, settings: GameSettings, variation?: GameVariation): GameState => {
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

  let newSnake = state.snake;
  let newScore = state.score;
  let newFoods = [...state.foods];
  let newEffects = [...state.activeEffects];

  if (ateFood) {
    const eatenFood = state.foods[eatenFoodIndex];
    const powerup = variation?.enabledPowerups.find((p) => p.id === eatenFood!.powerupId);

    if (powerup) {
      // Apply permanent effect
      const effect: ActiveEffect = {
        powerupId: powerup.id,
        effect: powerup.effect,
        value: powerup.effectValue
      };
      newEffects.push(effect);

      // Apply immediate effects
      if (powerup.effect === "add_blocks") {
        // Add blocks to snake
        const blocksToAdd = Math.floor(powerup.effectValue);
        newSnake = [nextHead, ...state.snake];
        for (let i = 1; i < blocksToAdd; i++) {
          const tail = newSnake[newSnake.length - 1];
          if (tail) {
            newSnake.push({ x: tail.x, y: tail.y });
          }
        }
        newScore += 1;
      } else if (powerup.effect === "subtract_blocks") {
        // Remove blocks from snake (but keep minimum of 3)
        const blocksToRemove = Math.floor(powerup.effectValue);
        const minLength = 3;
        const newLength = Math.max(minLength, state.snake.length - blocksToRemove);
        newSnake = [nextHead, ...state.snake.slice(0, newLength - 1)];
        newScore += 1;
      } else {
        // Speed effects don't change snake length
        newSnake = [nextHead, ...state.snake.slice(0, state.snake.length - 1)];
        newScore += 1;
      }
    } else {
      // Default behavior (shouldn't happen)
      newSnake = [nextHead, ...state.snake];
      newScore += 1;
    }

    // Remove eaten food and spawn new one
    newFoods.splice(eatenFoodIndex, 1);
    
    if (variation) {
      // Spawn new food with random powerup
      const randomPowerup = variation.enabledPowerups[
        Math.floor(Math.random() * variation.enabledPowerups.length)
      ];
      if (randomPowerup) {
        newFoods.push(placeFoodItem(newSnake, settings.gridSize, newFoods, randomPowerup));
      }
    } else {
      // Default single food for classic mode
      const defaultPowerup: PowerupType = {
        id: "default-food",
        name: "Food",
        effect: "add_blocks",
        effectValue: 1,
        color: "#87ae73"
      };
      newFoods.push(placeFoodItem(newSnake, settings.gridSize, newFoods, defaultPowerup));
    }
  } else {
    // No food eaten, move normally
    newSnake = [nextHead, ...state.snake.slice(0, state.snake.length - 1)];
  }

  // Recalculate current speed based on effects
  const baseSpeed = variation?.baseSpeed || settings.speed;
  const newCurrentSpeed = calculateCurrentSpeed(baseSpeed, newEffects);

  return {
    ...state,
    snake: newSnake,
    foods: newFoods,
    direction,
    pendingDirection: direction,
    score: newScore,
    tickCount: state.tickCount + 1,
    activeEffects: newEffects,
    currentSpeed: newCurrentSpeed
  };
};
