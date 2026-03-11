import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ColorPickerField } from "../ColorPickerField";

const meta = {
  title: "Settings/ColorPickerField",
  component: ColorPickerField,
  args: {
    label: "Snake",
    value: "#8fbc8f",
    helperText: "Pick a game color"
  }
} satisfies Meta<typeof ColorPickerField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onChange: () => {}
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <ColorPickerField {...args} value={value} onChange={setValue} />;
  }
};
