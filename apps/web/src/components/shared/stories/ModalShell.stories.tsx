import type { Meta, StoryObj } from "@storybook/react";
import { Stack, Typography } from "@mui/material";
import { ModalShell } from "../ModalShell";

const meta = {
  title: "Shared/ModalShell",
  component: ModalShell,
  args: {
    open: true,
    ariaLabelledBy: "story-modal-title",
    ariaDescribedBy: "story-modal-description"
  }
} satisfies Meta<typeof ModalShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  render: (args) => (
    <ModalShell {...args}>
      <Stack spacing={1}>
        <Typography id="story-modal-title" variant="h6">
          Modal Title
        </Typography>
        <Typography id="story-modal-description" color="text.secondary">
          Accessible dialog semantics with title and description.
        </Typography>
      </Stack>
    </ModalShell>
  )
};
