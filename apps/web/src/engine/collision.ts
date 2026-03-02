import type { Cell } from "../types/game";
import { isSameCell } from "./grid";

export const collidesWithSnake = (cell: Cell, snake: Cell[]): boolean => {
  return snake.some((segment) => isSameCell(segment, cell));
};
