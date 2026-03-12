import type { Profile } from "@snake/contracts";
import type { Meta, StoryObj } from "@storybook/react";
import { DeleteProfileDialog } from "../DeleteProfileDialog";

const profile: Profile = {
  id: "profile-1",
  name: "Jenny",
  avatarBase64: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true
};

const meta = {
  title: "Profile/DeleteProfileDialog",
  component: DeleteProfileDialog,
  args: {
    open: true,
    profile,
    onClose: () => {},
    onDelete: async () => {}
  }
} satisfies Meta<typeof DeleteProfileDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
