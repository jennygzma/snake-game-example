import { Box } from "@mui/material";
import type { Cell } from "../../types/game";
import { gameTokens } from "../../theme/tokens";

type GameBoardProps = {
  gridSize: number;
  snake: Cell[];
  food: Cell;
};

const toKey = (cell: Cell): string => `${cell.x}:${cell.y}`;

export const GameBoard = ({ gridSize, snake, food }: GameBoardProps) => {
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
        backgroundColor: gameTokens.colors.boardBg
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
              border: `1px solid ${gameTokens.colors.boardGrid}`,
              backgroundColor: isHead
                ? gameTokens.colors.snakeHead
                : isSnake
                  ? gameTokens.colors.snake
                  : isFood
                    ? gameTokens.colors.food
                    : "transparent"
            }}
          />
        );
      })}
    </Box>
  );
};
