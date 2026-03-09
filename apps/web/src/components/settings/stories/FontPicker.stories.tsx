import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FontPicker } from "../FontPicker";

const meta = {
  title: "Settings/FontPicker",
  component: FontPicker,
  args: {
    value: "Space Grotesk"
  }
} satisfies Meta<typeof FontPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onChange: () => {}
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <FontPicker {...args} value={value} onChange={setValue} />;
  }
};
