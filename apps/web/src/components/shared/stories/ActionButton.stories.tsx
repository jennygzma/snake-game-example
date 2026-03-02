import type { Meta, StoryObj } from "@storybook/react";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import ReplayRounded from "@mui/icons-material/ReplayRounded";
import { Stack } from "@mui/material";
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
      <ActionButton tone="play" icon={<PlayArrowRounded />}>
        Start
      </ActionButton>
      <ActionButton tone="pause" icon={<PauseRounded />}>
        Pause
      </ActionButton>
      <ActionButton tone="neutral" icon={<ReplayRounded />}>
        Reset
      </ActionButton>
      <ActionButton tone="danger">Delete</ActionButton>
    </Stack>
  )
};

export const IconOnlyOnSmallScreen: Story = {
  render: () => (
    <Stack spacing={1.5} direction="row" sx={{ width: 240 }}>
      <ActionButton tone="play" icon={<PlayArrowRounded />} iconOnly aria-label="Start">
        Start
      </ActionButton>
      <ActionButton tone="pause" icon={<PauseRounded />} iconOnly aria-label="Pause">
        Pause
      </ActionButton>
      <ActionButton tone="neutral" icon={<ReplayRounded />} iconOnly aria-label="Reset">
        Reset
      </ActionButton>
    </Stack>
  )
};
