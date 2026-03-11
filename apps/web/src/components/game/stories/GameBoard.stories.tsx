import type { Meta, StoryObj } from "@storybook/react";
import { GameBoard } from "../GameBoard";

const meta = {
  title: "Game/GameBoard",
  component: GameBoard,
  args: {
    gridSize: 12,
    snake: [
      { x: 3, y: 6 },
      { x: 2, y: 6 },
      { x: 1, y: 6 }
    ],
    foods: [
      { position: { x: 8, y: 4 }, effect: "double_points", value: 1, color: "#87ae73" }
    ]
  }
} satisfies Meta<typeof GameBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    foods: [
      { position: { x: 8, y: 4 }, effect: "double_points", value: 1, color: "#87ae73" }
    ]
  }
};
