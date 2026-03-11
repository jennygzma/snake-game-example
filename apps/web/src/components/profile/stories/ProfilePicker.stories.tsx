import type { Profile } from "@snake/contracts";
import type { Meta, StoryObj } from "@storybook/react";
import { ProfilePicker } from "../ProfilePicker";

const profiles: Profile[] = [
  {
    id: "profile-1",
    name: "Jenny",
    avatarBase64: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: "profile-2",
    name: "Alex",
    avatarBase64: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: false
  }
];

const meta = {
  title: "Profile/ProfilePicker",
  component: ProfilePicker,
  args: {
    profiles,
    onSelectProfile: () => {},
    onCreateProfile: async () => {}
  }
} satisfies Meta<typeof ProfilePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
