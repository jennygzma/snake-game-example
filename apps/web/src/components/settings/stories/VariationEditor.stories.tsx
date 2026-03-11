import type { Meta, StoryObj } from "@storybook/react";
import { VariationEditor } from "../VariationEditor";
import { DEFAULT_CLASSIC_VARIATION } from "@snake/contracts";

const meta = {
  title: "Settings/VariationEditor",
  component: VariationEditor,
  parameters: { layout: "centered" },
  args: {
    onSave: (data) => console.log("Save:", data),
    onCancel: () => console.log("Cancel")
  }
} satisfies Meta<typeof VariationEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CreateNew: Story = {
  args: {}
};

export const EditExisting: Story = {
  args: {
    variation: {
      id: "test-var-1",
      profileId: "test-profile-1",
      name: "Speed Demon",
      description: "Fast-paced gameplay with speed powerups",
      difficulty: "hard",
      baseSpeed: 12,
      gridSize: 24,
      maxConcurrentFoods: 3,
      powerupTypes: [
        { effect: "speed_increase", value: 2, color: "#5BB9C2" },
        { effect: "double_points", value: 2, color: "#FDB813" },
        { effect: "add_blocks", value: 3, color: "#87ae73" }
      ],
      usageCount: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
};

export const ClassicVariation: Story = {
  args: {
    variation: {
      id: "classic-1",
      profileId: "test-profile-1",
      ...DEFAULT_CLASSIC_VARIATION,
      usageCount: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
};