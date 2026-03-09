import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { AppShell } from "../AppShell";

const meta = {
  title: "Shared/AppShell",
  component: AppShell,
  parameters: {
    layout: "fullscreen"
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/"]}>
        <Story />
      </MemoryRouter>
    )
  ]
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Page Content
        </Typography>
        <Typography variant="body1">
          This demonstrates the AppShell with navigation icons in the top right.
        </Typography>
      </Box>
    )
  }
};

export const OnGamePage: Story = {
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
          Game Page
        </Typography>
        <Typography variant="body1">
          The Game icon should be highlighted in the navigation.
        </Typography>
      </Box>
    )
  }
};

export const OnStatsPage: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/stats"]}>
        <Story />
      </MemoryRouter>
    )
  ],
  args: {
    children: (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Stats Page
        </Typography>
        <Typography variant="body1">
          The Statistics icon should be highlighted in the navigation.
        </Typography>
      </Box>
    )
  }
};

export const OnSettingsPage: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/settings"]}>
        <Story />
      </MemoryRouter>
    )
  ],
  args: {
    children: (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Settings Page
        </Typography>
        <Typography variant="body1">
          The Settings icon should be highlighted in the navigation.
        </Typography>
      </Box>
    )
  }
};