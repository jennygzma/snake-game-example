import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "@mui/material";
import { AppButton } from "../AppButton";

const meta = {
  title: "Shared/AppButton",
  component: AppButton,
  args: {
    children: "Button"
  }
} satisfies Meta<typeof AppButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <Stack spacing={1.5} direction="row">
      <AppButton tone="primary">Primary</AppButton>
      <AppButton tone="neutral">Neutral</AppButton>
      <AppButton tone="danger">Danger</AppButton>
    </Stack>
  )
};

export const OutlinedAndText: Story = {
  render: () => (
    <Stack spacing={1.5} direction="row">
      <AppButton tone="neutral" variant="outlined">
        Edit
      </AppButton>
      <AppButton tone="danger" variant="text">
        Delete
      </AppButton>
    </Stack>
  )
};
