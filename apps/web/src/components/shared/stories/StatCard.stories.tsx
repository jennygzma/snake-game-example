import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "@mui/material";
import { StatCard } from "../StatCard";

const meta = {
  title: "Shared/StatCard",
  component: StatCard,
  args: {
    label: "Score",
    value: 12
  }
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Multiple: Story = {
  render: () => (
    <Stack spacing={1.5} sx={{ width: 320 }}>
      <StatCard label="Score" value={12} />
      <StatCard label="High Score" value={48} />
      <StatCard label="Status" value="running" />
    </Stack>
  )
};
