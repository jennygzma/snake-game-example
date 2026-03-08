import type { Meta, StoryObj } from "@storybook/react";
import { SaveThemeDialog } from "./SaveThemeDialog";

const meta: Meta<typeof SaveThemeDialog> = {
  component: SaveThemeDialog,
  title: "Settings/SaveThemeDialog",
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof SaveThemeDialog>;

export const Default: Story = {
  args: {
    open: true,
    onSave: (name: string) => {
      console.log("Save theme:", name);
    },
    onCancel: () => {
      console.log("Cancel");
    }
  }
};

export const WithDefaultName: Story = {
  args: {
    open: true,
    defaultName: "My Custom Theme",
    onSave: (name: string) => {
      console.log("Save theme:", name);
    },
    onCancel: () => {
      console.log("Cancel");
    }
  }
};

export const Closed: Story = {
  args: {
    open: false,
    onSave: (name: string) => {
      console.log("Save theme:", name);
    },
    onCancel: () => {
      console.log("Cancel");
    }
  }
};