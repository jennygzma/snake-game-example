import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { AppShell } from "../AppShell";

const meta = {
  title: "Shared/AppShell",
  component: AppShell,
  parameters: {
    layout: "fullscreen"
  }
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleContent = ({ page }: { page: string }) => (
  <Box sx={{ p: 4 }}>
    <Typography variant="h4">{page} Page</Typography>
    <Typography variant="body1" color="text.secondary">
      This is sample content for the {page.toLowerCase()} page.
    </Typography>
  </Box>
);

export const GamePage: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/"]}>
        <Story />
      </MemoryRouter>
    )
  ],
  args: {
    children: <SampleContent page="Game" />
  }
};

export const StatsPage: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/stats"]}>
        <Story />
      </MemoryRouter>
    )
  ],
  args: {
    children: <SampleContent page="Stats" />
  }
};

export const SettingsPage: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/settings"]}>
        <Story />
      </MemoryRouter>
    )
  ],
  args: {
    children: <SampleContent page="Settings" />
  }
};

export const WithLongContent: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/"]}>
        <Story />
      </MemoryRouter>
    )
  ],
  args: {
    children: (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Page with Long Content
        </Typography>
        {Array.from({ length: 20 }, (_, i) => (
          <Typography key={i} paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </Typography>
        ))}
      </Box>
    )
  }
};
