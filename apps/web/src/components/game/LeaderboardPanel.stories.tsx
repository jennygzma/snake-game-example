import type { LeaderboardEntry } from "@snake/contracts";
import type { Meta, StoryObj } from "@storybook/react";
import { LeaderboardPanel } from "./LeaderboardPanel";

const entries: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: "u-1",
    profileName: "Player 1",
    score: 42,
    endedAt: "2026-03-08T12:00:00.000Z"
  },
  {
    rank: 2,
    userId: "u-2",
    profileName: "Player 2",
    score: 37,
    endedAt: "2026-03-07T12:00:00.000Z"
  }
];

const meta = {
  title: "Game/LeaderboardPanel",
  component: LeaderboardPanel,
  args: {
    entries
  }
} satisfies Meta<typeof LeaderboardPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    entries: []
  }
};
