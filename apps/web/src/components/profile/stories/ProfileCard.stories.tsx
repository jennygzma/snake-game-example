import type { Profile } from "@snake/contracts";
import type { Meta, StoryObj } from "@storybook/react";
import { ProfileCard } from "../ProfileCard";

const profile: Profile = {
  id: "profile-1",
  name: "Jenny",
  avatarBase64: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true
};

const meta = {
  title: "Profile/ProfileCard",
  component: ProfileCard,
  args: {
    profile,
    onSelect: () => {}
  }
} satisfies Meta<typeof ProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
