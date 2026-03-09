import type { CustomTheme } from "@snake/contracts";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeGallery } from "../ThemeGallery";

const now = new Date().toISOString();

const themes: CustomTheme[] = [
  {
    id: "theme-1",
    userId: "user-1",
    name: "Forest",
    fontFamily: "Space Grotesk",
    colors: {
      bg: "#111417",
      panel: "#1e252b",
      panelBorder: "#2f3a44",
      text: "#f5f7fa",
      textMuted: "#b6c0c9",
      snake: "#8fbc8f",
      snakeHead: "#7ea57e",
      food: "#e07a7a",
      boardGrid: "#2e3944",
      boardBg: "#101418",
      action: "#8fbc8f",
      actionHover: "#7ea57e",
      actionText: "#0b1116",
      pause: "#f0b429",
      pauseHover: "#e2a31f",
      pauseText: "#151515",
      neutral: "#7a8794",
      neutralHover: "#6e7a85",
      neutralText: "#ffffff",
      danger: "#d64545",
      dangerHover: "#be3737",
      dangerText: "#ffffff"
    },
    iconColors: {
      default: "#ffffff"
    },
    createdAt: now,
    updatedAt: now,
    isActive: true
  }
];

const meta = {
  title: "Settings/ThemeGallery",
  component: ThemeGallery,
  args: {
    themes,
    activeThemeId: "theme-1",
    onActivate: async () => {},
    onEdit: () => {},
    onDelete: async () => {}
  }
} satisfies Meta<typeof ThemeGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    themes: []
  }
};
