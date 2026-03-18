import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "@mui/material";
import { approvedIcons } from "../../../theme/approvedIcons";
import { IconActionButton } from "../IconActionButton";

const meta = {
  title: "Shared/IconActionButton",
  component: IconActionButton,
  args: {
    label: "Save",
    icon: <approvedIcons.check />,
    onClick: () => {}
  }
} satisfies Meta<typeof IconActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ResponsiveLabel: Story = {};

export const IconOnly: Story = {
  args: {
    label: "Delete",
    icon: <approvedIcons.delete />,
    tone: "danger",
    iconOnly: true
  }
};

export const Group: Story = {
  render: () => (
    <Stack direction="row" spacing={1}>
      <IconActionButton label="Add" icon={<approvedIcons.add />} onClick={() => {}} />
      <IconActionButton label="Edit" icon={<approvedIcons.edit />} tone="neutral" onClick={() => {}} />
      <IconActionButton label="Delete" icon={<approvedIcons.delete />} tone="danger" iconOnly onClick={() => {}} />
    </Stack>
  )
};
