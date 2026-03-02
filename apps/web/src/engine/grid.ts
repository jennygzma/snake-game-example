import type { Cell } from "../types/game";

export const isSameCell = (a: Cell, b: Cell): boolean => a.x === b.x && a.y === b.y;

export const isInBounds = (cell: Cell, gridSize: number): boolean => {
  return cell.x >= 0 && cell.y >= 0 && cell.x < gridSize && cell.y < gridSize;
};

export const randomCell = (gridSize: number): Cell => ({
  x: Math.floor(Math.random() * gridSize),
  y: Math.floor(Math.random() * gridSize)
});
