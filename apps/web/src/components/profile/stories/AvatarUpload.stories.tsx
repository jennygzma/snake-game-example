import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AvatarUpload } from "../AvatarUpload";

const meta = {
  title: "Profile/AvatarUpload",
  component: AvatarUpload,
  args: {
    currentAvatar: null
  }
} satisfies Meta<typeof AvatarUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onAvatarChange: () => {}
  },
  render: (args) => {
    const [avatar, setAvatar] = useState<string | null>(args.currentAvatar);
    return <AvatarUpload currentAvatar={avatar} onAvatarChange={setAvatar} />;
  }
};
