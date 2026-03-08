import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "@mui/material";
import { approvedIcons } from "../../../theme/approvedIcons";
import { ActionButton } from "../ActionButton";

const meta = {
  title: "Shared/ActionButton",
  component: ActionButton,
  args: {
    children: "Button",
    tone: "play"
  }
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <Stack spacing={1.5} sx={{ width: 320 }}>
      <ActionButton tone="play" icon={<approvedIcons.play />}>
        Start
      </ActionButton>
      <ActionButton tone="pause" icon={<approvedIcons.pause />}>
        Pause
      </ActionButton>
      <ActionButton tone="neutral" icon={<approvedIcons.replay />}>
        Reset
      </ActionButton>
      <ActionButton tone="danger">Delete</ActionButton>
    </Stack>
  )
};

export const IconOnlyOnSmallScreen: Story = {
  render: () => (
    <Stack spacing={1.5} direction="row" sx={{ width: 240 }}>
      <ActionButton tone="play" icon={<approvedIcons.play />} iconOnly aria-label="Start">
        Start
      </ActionButton>
      <ActionButton tone="pause" icon={<approvedIcons.pause />} iconOnly aria-label="Pause">
        Pause
      </ActionButton>
      <ActionButton tone="neutral" icon={<approvedIcons.replay />} iconOnly aria-label="Reset">
        Reset
      </ActionButton>
    </Stack>
  )
};
