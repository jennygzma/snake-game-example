import type { Meta, StoryObj } from "@storybook/react";
import { VariationEditor } from "../VariationEditor";

const meta = {
  title: "Settings/VariationEditor",
  component: VariationEditor,
  parameters: {
    layout: "padded"
  }
} satisfies Meta<typeof VariationEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSave: (data) => {
      console.log("Save variation:", data);
    }
  }
};

export const EditMode: Story = {
  args: {
    initialData: {
      name: "Speed Challenge",
      description: "Fast-paced game with multiple power-ups",
      difficulty: "hard",
      maxConcurrentFoods: 3,
      baseSpeed: 15,
      gridSize: 20,
      powerupTypes: [
        { effect: "speed_increase", value: 2, color: "#87ae73" },
        { effect: "double_points", value: 3, color: "#FDB813" },
        { effect: "add_blocks", value: 2, color: "#5BB9C2" }
      ]
    },
    onSave: (data) => {
      console.log("Update variation:", data);
    },
    onCancel: () => {
      console.log("Cancel edit");
    }
  }
};

export const WithSnakeHeadImage: Story = {
  args: {
    initialData: {
      name: "Custom Snake",
      description: "Game with custom snake head image",
      difficulty: "medium",
      maxConcurrentFoods: 2,
      baseSpeed: 10,
      gridSize: 20,
      powerupTypes: [
        { effect: "double_points", value: 2, color: "#FDB813" }
      ],
      snakeHeadImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='10' cy='10' r='8' fill='%2387ae73'/%3E%3C/svg%3E"
    },
    onSave: (data) => {
      console.log("Save with image:", data);
    },
    onCancel: () => {
      console.log("Cancel");
    }
  }
};