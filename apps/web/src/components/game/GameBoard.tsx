import { Box, useTheme } from "@mui/material";
import type { Cell, FoodItem } from "../../types/game";

type GameBoardProps = {
  gridSize: number;
  snake: Cell[];
  foods: FoodItem[];
  snakeHeadImage?: string;
  boardBackgroundColor?: string;
};

const toKey = (cell: Cell): string => `${cell.x}:${cell.y}`;

export const GameBoard = ({ 
  gridSize, 
  snake, 
  foods,
  snakeHeadImage,
  boardBackgroundColor 
}: GameBoardProps) => {
  const theme = useTheme();
  const snakeSet = new Set(snake.map(toKey));
  const head = snake[0];
  const snakeHeadKey = head ? toKey(head) : "";
  
  // Create a map of food positions to food items
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
        const isSnake = snakeSet.has(key);
        const isHead = key === snakeHeadKey;

        let cellStyle: React.CSSProperties = {
          border: `1px solid ${theme.game.boardGrid}`
        };

        if (isHead && snakeHeadImage) {
          // Render snake head with custom image
          cellStyle = {
            ...cellStyle,
            backgroundImage: `url(${snakeHeadImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          };
        } else if (isHead) {
          cellStyle.backgroundColor = theme.game.snakeHead;
        } else if (isSnake) {
          cellStyle.backgroundColor = theme.game.snake;
        } else if (food) {
          // Render food with custom color and optional image
          if (food.image) {
            cellStyle = {
              ...cellStyle,
              backgroundImage: `url(${food.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            };
          } else {
            cellStyle.backgroundColor = food.color;
          }
        } else {
          cellStyle.backgroundColor = "transparent";
        }

        return (
          <Box
            key={key}
            sx={cellStyle}
          />
        );
      })}
    </Box>
  );
};
