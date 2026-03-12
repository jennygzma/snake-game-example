import { Box, useTheme } from "@mui/material";
import type { Cell, FoodItem } from "../../types/game";

type GameBoardProps = {
  gridSize: number;
  snake: Cell[];
  foods: FoodItem[];
  snakeHeadImage?: string;
  boardBackgroundColor?: string;
  snakeColor?: string;
  snakeHeadColor?: string;
  boardGridColor?: string;
};

const toKey = (cell: Cell): string => `${cell.x}:${cell.y}`;

export const GameBoard = ({
  gridSize,
  snake,
  foods,
  snakeHeadImage,
  boardBackgroundColor,
  snakeColor,
  snakeHeadColor,
  boardGridColor
}: GameBoardProps) => {
  const theme = useTheme();
  const snakeSet = new Set(snake.map(toKey));
  const head = snake[0];
  const snakeHeadKey = head ? toKey(head) : "";
  const foodMap = new Map(foods.map((food) => [toKey(food.position), food]));
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
        backgroundColor: boardBackgroundColor || theme.game.boardBg
      }}
    >
      {cells.map((cell) => {
        const key = toKey(cell);
        const food = foodMap.get(key);
        const isFood = food !== undefined;
        const isSnake = snakeSet.has(key);
        const isHead = key === snakeHeadKey;

        return (
          <Box
            key={key}
            sx={{
              border: `1px solid ${theme.game.boardGrid}`,
              borderColor: boardGridColor || theme.game.boardGrid,
              backgroundColor: isHead
                ? snakeHeadColor || theme.game.snakeHead
                : isSnake
                  ? snakeColor || theme.game.snake
                  : isFood
                    ? food?.color
                    : "transparent",
              backgroundImage: isHead && snakeHeadImage
                ? `url(${snakeHeadImage})`
                : isFood && food?.image
                  ? `url(${food.image})`
                  : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />
        );
      })}
    </Box>
  );
};
