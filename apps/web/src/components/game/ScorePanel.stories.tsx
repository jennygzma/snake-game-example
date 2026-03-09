import type { Meta, StoryObj } from "@storybook/react";
import { ScorePanel } from "./ScorePanel";

const meta = {
  title: "Game/ScorePanel",
  component: ScorePanel,
  args: {
    score: 12,
    highScore: 32,
    status: "running"
  }
} satisfies Meta<typeof ScorePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Paused: Story = {
  args: {
    status: "paused"
  }
};

export const GameOver: Story = {
  args: {
    status: "game-over",
    score: 42
  }
};