import type { Profile } from "@snake/contracts";
import type { Meta, StoryObj } from "@storybook/react";
import { ScorePanel } from "./ScorePanel";

const demoPlayer: Profile = {
  id: "demo-player-1",
  name: "Player",
  avatarBase64: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true
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
