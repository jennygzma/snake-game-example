import { Box, useTheme } from "@mui/material";
import type { Cell, FoodItem } from "../../types/game";

type GameBoardProps = {
  gridSize: number;
  snake: Cell[];
  foods: FoodItem[];
  snakeHeadImage?: string;
};

const toKey = (cell: Cell): string => `${cell.x}:${cell.y}`;

export const GameBoard = ({ gridSize, snake, foods, snakeHeadImage }: GameBoardProps) => {
  const theme = useTheme();
  const snakeSet = new Set(snake.map(toKey));
  const head = snake[0];
  const snakeHeadKey = head ? toKey(head) : "";
  const foodMap = new Map(foods.map(f => [toKey(f.position), f]));
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
        borderColor: theme.ui.gameBoard.border,
        borderRadius: 1,
        overflow: "hidden",
        backgroundColor: theme.game.boardBg
      }}
    >
      {cells.map((cell) => {
        const key = toKey(cell);
        const food = foodMap.get(key);
        const isSnake = snakeSet.has(key);
        const isHead = key === snakeHeadKey;

        const backgroundStyle = isHead && snakeHeadImage
          ? {
              backgroundImage: `url(${snakeHeadImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }
          : isHead
            ? { backgroundColor: theme.game.snakeHead }
            : isSnake
              ? { backgroundColor: theme.game.snake }
              : food
                ? food.imageBase64
                  ? {
                      backgroundImage: `url(${food.imageBase64})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }
                  : { backgroundColor: food.color }
                : { backgroundColor: "transparent" };

        return (
          <Box
            key={key}
            sx={{
              border: `1px solid ${theme.game.boardGrid}`,
              ...backgroundStyle
            }}
          />
        );
      })}
    </Box>
  );
};
