import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "@mui/material";
import { approvedIcons } from "../../../theme/approvedIcons";
import { NavIconButton } from "../NavIconButton";

const meta = {
  title: "Shared/NavIconButton",
  component: NavIconButton,
  args: {
    label: "Game",
    onClick: () => {},
    icon: <approvedIcons.sportsEsports />
  }
} satisfies Meta<typeof NavIconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inactive: Story = {};

export const Active: Story = {
  args: {
    active: true
  }
};

export const Group: Story = {
  render: () => (
    <Stack direction="row" spacing={1}>
      <NavIconButton label="Game" onClick={() => {}} active icon={<approvedIcons.sportsEsports />} />
      <NavIconButton label="Statistics" onClick={() => {}} icon={<approvedIcons.barChart />} />
      <NavIconButton label="Settings" onClick={() => {}} icon={<approvedIcons.settings />} />
    </Stack>
  )
};
