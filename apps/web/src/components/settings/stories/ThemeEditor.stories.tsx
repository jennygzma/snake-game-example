import type { Meta, StoryObj } from "@storybook/react";
import { ThemeEditor } from "../ThemeEditor";

const meta = {
  title: "Settings/ThemeEditor",
  component: ThemeEditor,
  args: {
    onSave: async () => {}
  }
} satisfies Meta<typeof ThemeEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
