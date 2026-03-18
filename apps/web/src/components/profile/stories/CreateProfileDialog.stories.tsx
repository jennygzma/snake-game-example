import type { Meta, StoryObj } from "@storybook/react";
import { CreateProfileDialog } from "../CreateProfileDialog";

const meta = {
  title: "Profile/CreateProfileDialog",
  component: CreateProfileDialog,
  args: {
    open: true,
    onClose: () => {},
    onCreate: async () => {}
  }
} satisfies Meta<typeof CreateProfileDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
