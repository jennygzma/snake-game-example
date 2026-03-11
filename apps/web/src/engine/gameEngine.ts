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

const placeFood = (snake: Cell[], existingFoods: FoodItem[], gridSize: number): Cell => {
  let next = randomCell(gridSize);
  const allPositions = [...existingFoods.map(f => f.position)];
  while (collidesWithSnake(next, snake) || allPositions.some(p => isSameCell(p, next))) {
    next = randomCell(gridSize);
  }
  return next;
};

const selectRandomPowerup = (powerups: PowerupType[]): PowerupType | null => {
  if (powerups.length === 0) return null;
  
  // Weight-based selection
  const totalWeight = powerups.reduce((sum, p) => sum + p.spawnWeight, 0);
  if (totalWeight === 0) return powerups[0];
  
  let random = Math.random() * totalWeight;
  for (const powerup of powerups) {
    random -= powerup.spawnWeight;
    if (random <= 0) return powerup;
  }
  
  return powerups[0];
};

const spawnFoodItem = (
  snake: Cell[],
  existingFoods: FoodItem[],
  gridSize: number,
  powerups: PowerupType[]
): FoodItem | null => {
  const powerup = selectRandomPowerup(powerups);
  if (!powerup) return null;

  const position = placeFood(snake, existingFoods, gridSize);
  
  return {
    position,
    powerupId: powerup.id,
    color: powerup.color,
    imageBase64: powerup.imageBase64
  };
};

const calculateCurrentSpeed = (baseSpeed: number, effects: ActiveEffect[]): number => {
  let speed = baseSpeed;
  
  for (const effect of effects) {
    if (effect.effect === "speed_boost") {
      speed *= effect.value;
    } else if (effect.effect === "speed_reduction") {
      speed /= effect.value;
    }
  }
  
  return Math.max(1, Math.min(30, speed));
};

export const createInitialState = (
  settings: GameSettings,
  variation?: GameVariation
): GameState => {
  const mid = Math.floor(settings.gridSize / 2);
  const snake: Cell[] = Array.from({ length: START_LENGTH }, (_, index) => ({
    x: mid - index,
    y: mid
  }));

  const baseSpeed = variation?.baseSpeed ?? settings.speed;
  const maxFoods = variation?.maxConcurrentFoods ?? 1;
  const powerups = variation?.powerups ?? [];

  // Spawn initial foods
  const foods: FoodItem[] = [];
  for (let i = 0; i < maxFoods; i++) {
    const foodItem = spawnFoodItem(snake, foods, settings.gridSize, powerups);
    if (foodItem) foods.push(foodItem);
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
  variation?: GameVariation
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

  // Check if head collides with any food
  const eatenFoodIndex = state.foods.findIndex(f => isSameCell(nextHead, f.position));
  const ateFood = eatenFoodIndex >= 0;
  
  let newSnake = state.snake;
  let newScore = state.score;
  let newFoods = [...state.foods];
  let newEffects = [...state.activeEffects];
  
  if (ateFood) {
    const eatenFood = state.foods[eatenFoodIndex];
    const powerups = variation?.powerups ?? [];
    const powerup = powerups.find(p => p.id === eatenFood.powerupId);
    
    if (powerup) {
      // Apply powerup effect
      switch (powerup.effect) {
        case "speed_boost":
        case "speed_reduction":
          if (powerup.isPermanent) {
            newEffects.push({
              powerupId: powerup.id,
              effect: powerup.effect,
              value: powerup.value,
              appliedAt: Date.now()
            });
          }
          newSnake = [nextHead, ...state.snake];
          newScore += 1;
          break;
          
        case "point_multiplier":
          newSnake = [nextHead, ...state.snake];
          newScore += Math.floor(powerup.value);
          break;
          
        case "length_add":
          // Add blocks immediately
          const blocksToAdd = Math.floor(powerup.value);
          newSnake = [nextHead, ...state.snake];
          for (let i = 0; i < blocksToAdd - 1; i++) {
            const tail = newSnake[newSnake.length - 1];
            if (tail) newSnake.push({ ...tail });
          }
          newScore += 1;
          break;
          
        case "length_subtract":
          // Remove blocks immediately
          const blocksToRemove = Math.floor(powerup.value);
          const minLength = 1;
          const newLength = Math.max(minLength, state.snake.length - blocksToRemove);
          newSnake = [nextHead, ...state.snake.slice(0, newLength - 1)];
          newScore += 1;
          break;
          
        default:
          newSnake = [nextHead, ...state.snake];
          newScore += 1;
      }
    } else {
      // Default behavior if powerup not found
      newSnake = [nextHead, ...state.snake];
      newScore += 1;
    }
    
    // Remove eaten food and spawn a new one
    newFoods.splice(eatenFoodIndex, 1);
    const maxFoods = variation?.maxConcurrentFoods ?? 1;
    if (newFoods.length < maxFoods) {
      const newFoodItem = spawnFoodItem(
        newSnake,
        newFoods,
        settings.gridSize,
        powerups
      );
      if (newFoodItem) newFoods.push(newFoodItem);
    }
  } else {
    // No food eaten, move snake normally
    newSnake = [nextHead, ...state.snake.slice(0, state.snake.length - 1)];
  }
  
  // Calculate new speed based on active effects
  const baseSpeed = variation?.baseSpeed ?? settings.speed;
  const newSpeed = calculateCurrentSpeed(baseSpeed, newEffects);

  return {
    ...state,
    snake: newSnake,
    foods: newFoods,
    direction,
    pendingDirection: direction,
    score: newScore,
    tickCount: state.tickCount + 1,
    activeEffects: newEffects,
    currentSpeed: newSpeed
  };
};
