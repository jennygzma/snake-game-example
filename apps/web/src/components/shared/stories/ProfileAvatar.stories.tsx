import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "@mui/material";
import { ProfileAvatar } from "../ProfileAvatar";

const meta = {
  title: "Shared/ProfileAvatar",
  component: ProfileAvatar,
  args: {
    alt: "Player avatar",
    src: null
  }
} satisfies Meta<typeof ProfileAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultIcon: Story = {};

export const WithImage: Story = {
  args: {
    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='64' height='64' fill='%231f6d2f'/%3E%3Ccircle cx='32' cy='24' r='12' fill='%23eff3e9'/%3E%3Crect x='14' y='40' width='36' height='14' rx='7' fill='%23eff3e9'/%3E%3C/svg%3E"
  }
};

export const Sizes: Story = {
  render: () => (
    <Stack direction="row" spacing={2} alignItems="center">
      <ProfileAvatar src={null} size={28} alt="Small avatar" />
      <ProfileAvatar src={null} size={40} alt="Medium avatar" />
      <ProfileAvatar src={null} size={56} alt="Large avatar" />
    </Stack>
  )
};
