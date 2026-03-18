import type { Meta, StoryObj } from "@storybook/react";
import { SaveThemeDialog } from "../SaveThemeDialog";

const meta = {
  title: "Settings/SaveThemeDialog",
  component: SaveThemeDialog,
  args: {
    open: true,
    initialName: "Forest Theme",
    onClose: () => {},
    onSave: async () => {}
  }
} satisfies Meta<typeof SaveThemeDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
