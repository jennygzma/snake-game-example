import type { Meta, StoryObj } from "@storybook/react";
import { HubThemeCard } from "../HubThemeCard";
import type { SharedThemeWithCreator } from "@snake/contracts";

const meta = {
  title: "Hub/HubThemeCard",
  component: HubThemeCard,
  parameters: {
    layout: "padded"
  },
  tags: ["autodocs"]
} satisfies Meta<typeof HubThemeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockTheme: SharedThemeWithCreator = {
  id: "theme-1",
  creatorProfileId: "profile-1",
  name: "Dark Forest",
  description: "A mysterious dark theme with forest vibes",
  fontFamily: "Inter",
  colors: {
    bg: "#1a1a1a",
    panel: "#2d2d2d",
    panelBorder: "#3d3d3d",
    text: "#e0e0e0",
    textMuted: "#a0a0a0",
    snake: "#4caf50",
    snakeHead: "#66bb6a",
    food: "#ff5722",
    boardBg: "#121212",
    boardGrid: "#252525",
    action: "#2196f3",
    actionHover: "#1976d2",
    actionText: "#ffffff",
    pause: "#ff9800",
    pauseHover: "#f57c00",
    pauseText: "#ffffff",
    neutral: "#757575",
    neutralHover: "#616161",
    neutralText: "#ffffff",
    danger: "#f44336",
    dangerHover: "#d32f2f",
    dangerText: "#ffffff"
  },
  iconColors: {
    default: "#e0e0e0",
    active: "#2196f3",
    gameActive: "#4caf50",
    statsActive: "#ff9800",
    settingsActive: "#9c27b0"
  },
  favoriteCount: 42,
  usageCount: 156,
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-20T14:22:00Z",
  creator: {
    id: "profile-1",
    name: "Alice Designer",
    avatarBase64: undefined
  }
};

export const Default: Story = {
  args: {
    theme: mockTheme,
    isFavorited: false,
    onFavorite: () => console.log("Favorite clicked"),
    onUnfavorite: () => console.log("Unfavorite clicked"),
    onCopy: () => console.log("Copy clicked")
  }
};

export const Favorited: Story = {
  args: {
    theme: mockTheme,
    isFavorited: true,
    onFavorite: () => console.log("Favorite clicked"),
    onUnfavorite: () => console.log("Unfavorite clicked"),
    onCopy: () => console.log("Copy clicked")
  }
};

export const WithAvatar: Story = {
  args: {
    theme: {
      ...mockTheme,
      creator: {
        ...mockTheme.creator,
        avatarBase64: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%234caf50' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='48' fill='white'%3EA%3C/text%3E%3C/svg%3E"
      }
    },
    isFavorited: false,
    onFavorite: () => console.log("Favorite clicked"),
    onUnfavorite: () => console.log("Unfavorite clicked"),
    onCopy: () => console.log("Copy clicked")
  }
};

export const NoDescription: Story = {
  args: {
    theme: {
      ...mockTheme,
      description: undefined
    },
    isFavorited: false,
    onFavorite: () => console.log("Favorite clicked"),
    onUnfavorite: () => console.log("Unfavorite clicked"),
    onCopy: () => console.log("Copy clicked")
  }
};