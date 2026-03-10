import type { SaveThemeInput } from "@snake/contracts";
import { gameTokens } from "./tokens";

export type ThemeDraft = Omit<SaveThemeInput, "name">;

export const DEFAULT_THEME_DRAFT: ThemeDraft = {
  fontFamily: "Space Grotesk",
  colors: {
    bg: gameTokens.colors.bg,
    panel: gameTokens.colors.panel,
    panelBorder: gameTokens.colors.panelBorder,
    text: gameTokens.colors.text,
    textMuted: gameTokens.colors.textMuted,
    snake: gameTokens.colors.snake,
    snakeHead: gameTokens.colors.snakeHead,
    food: gameTokens.colors.food,
    boardGrid: gameTokens.colors.boardGrid,
    boardBg: gameTokens.colors.boardBg,
    action: gameTokens.colors.action,
    actionHover: gameTokens.colors.actionHover,
    actionText: gameTokens.colors.actionText,
    pause: gameTokens.colors.pause,
    pauseHover: gameTokens.colors.pauseHover,
    pauseText: gameTokens.colors.pauseText,
    neutral: gameTokens.colors.neutral,
    neutralHover: gameTokens.colors.neutralHover,
    neutralText: gameTokens.colors.neutralText,
    danger: gameTokens.colors.danger,
    dangerHover: gameTokens.colors.dangerHover,
    dangerText: gameTokens.colors.dangerText
  },
  iconColors: {
    default: "#ffffff"
  }
};
