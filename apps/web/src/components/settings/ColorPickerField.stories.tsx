import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "@mui/material";
import { ColorPickerField } from "./ColorPickerField";

const meta: Meta<typeof ColorPickerField> = {
  component: ColorPickerField,
  title: "Settings/ColorPickerField",
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof ColorPickerField>;

const ColorPickerWithState = (args: { label: string; initialValue: string }) => {
  const [value, setValue] = useState(args.initialValue);
  return (
    <Box sx={{ width: 400 }}>
      <ColorPickerField label={args.label} value={value} onChange={setValue} />
    </Box>
  );
};

export const Default: Story = {
  render: () => <ColorPickerWithState label="Primary Color" initialValue="#87ae73" />
};

export const DarkColor: Story = {
  render: () => <ColorPickerWithState label="Background Color" initialValue="#2d2d2d" />
};

export const BrightColor: Story = {
  render: () => <ColorPickerWithState label="Action Color" initialValue="#FDB813" />
};

export const InvalidHex: Story = {
  render: () => <ColorPickerWithState label="Invalid Color" initialValue="#gggggg" />
};