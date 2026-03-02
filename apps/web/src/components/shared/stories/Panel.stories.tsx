import type { Meta, StoryObj } from "@storybook/react";
import { Stack, Typography } from "@mui/material";
import { Panel } from "../Panel";

const meta = {
  title: "Shared/Panel",
  component: Panel
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Stack sx={{ width: 340 }}>
      <Panel>
        <Typography variant="h6">Panel</Typography>
        <Typography variant="body2" color="text.secondary">
          Shared container styling from your token system.
        </Typography>
      </Panel>
    </Stack>
  )
};
