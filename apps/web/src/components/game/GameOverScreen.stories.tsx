import type { Meta, StoryObj } from "@storybook/react";
import { GameOverScreen } from "./GameOverScreen";

const meta = {
  title: "Game/GameOverScreen",
  component: GameOverScreen,
  args: {
    score: 18,
    onRestart: () => {}
  }
} satisfies Meta<typeof GameOverScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
