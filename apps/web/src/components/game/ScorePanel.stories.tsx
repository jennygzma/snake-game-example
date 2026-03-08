import type { Profile } from "@snake/contracts";
import type { Meta, StoryObj } from "@storybook/react";
import { ScorePanel } from "./ScorePanel";

const demoPlayer: Profile = {
  id: "player-1",
  name: "Jenny"
};

const meta = {
  title: "Game/ScorePanel",
  component: ScorePanel,
  args: {
    player: demoPlayer,
    score: 12,
    highScore: 32,
    status: "running"
  }
} satisfies Meta<typeof ScorePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    player: null,
    status: "idle"
  }
};
