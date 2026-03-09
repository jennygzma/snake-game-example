import { Box, useTheme } from "@mui/material";
import type { Cell } from "../../types/game";

type GameBoardProps = {
  gridSize: number;
  snake: Cell[];
  food: Cell;
};

const toKey = (cell: Cell): string => `${cell.x}:${cell.y}`;

export const GameBoard = ({ gridSize, snake, food }: GameBoardProps) => {
  const theme = useTheme();
  const snakeSet = new Set(snake.map(toKey));
  const head = snake[0];
  const snakeHeadKey = head ? toKey(head) : "";
  const foodKey = toKey(food);
  const cells = Array.from({ length: gridSize * gridSize }, (_, index) => ({
    x: index % gridSize,
    y: Math.floor(index / gridSize)
  }));

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        width: "min(100%, 720px)",
        aspectRatio: "1 / 1",
        mx: "auto",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        overflow: "hidden",
        backgroundColor: theme.game.boardBg
      }}
    >
      {cells.map((cell) => {
        const key = toKey(cell);
        const isFood = key === foodKey;
        const isSnake = snakeSet.has(key);
        const isHead = key === snakeHeadKey;

        return (
          <Box
            key={key}
            sx={{
              border: `1px solid ${theme.game.boardGrid}`,
              backgroundColor: isHead
                ? theme.game.snakeHead
                : isSnake
                  ? theme.game.snake
                  : isFood
                    ? theme.game.food
                    : "transparent"
            }}
          />
        );
      })}
    </Box>
  );
};
