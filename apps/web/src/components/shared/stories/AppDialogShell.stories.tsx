import type { Meta, StoryObj } from "@storybook/react";
import { Stack, Typography } from "@mui/material";
import { AppButton } from "../AppButton";
import { AppDialogShell } from "../AppDialogShell";

const meta = {
  title: "Shared/AppDialogShell",
  component: AppDialogShell,
  args: {
    open: true,
    title: "Delete Theme",
    titleId: "dialog-shell-title",
    description: "Deleting this theme will remove it from your profile.",
    descriptionId: "dialog-shell-description",
    actions: (
      <Stack direction="row" spacing={1}>
        <AppButton tone="neutral">Cancel</AppButton>
        <AppButton tone="danger">Delete</AppButton>
      </Stack>
    )
  }
} satisfies Meta<typeof AppDialogShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  render: (args) => (
    <AppDialogShell {...args}>
      <Typography variant="body2">This is an app-managed dialog shell with accessible labeling.</Typography>
    </AppDialogShell>
  )
};
