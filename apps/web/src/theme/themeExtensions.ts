import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    game: {
      snake: string;
      snakeHead: string;
      food: string;
      boardBg: string;
      boardGrid: string;
      action: string;
      actionHover: string;
      actionText: string;
      pause: string;
      pauseHover: string;
      pauseText: string;
      neutral: string;
      neutralHover: string;
      neutralText: string;
      danger: string;
      dangerHover: string;
      dangerText: string;
    };
    icons: {
      default: string;
      play?: string;
      pause?: string;
      reset?: string;
      settings?: string;
      stats?: string;
    };
  }

  interface ThemeOptions {
    game?: {
      snake?: string;
      snakeHead?: string;
      food?: string;
      boardBg?: string;
      boardGrid?: string;
      action?: string;
      actionHover?: string;
      actionText?: string;
      pause?: string;
      pauseHover?: string;
      pauseText?: string;
      neutral?: string;
      neutralHover?: string;
      neutralText?: string;
      danger?: string;
      dangerHover?: string;
      dangerText?: string;
    };
    icons?: {
      default?: string;
      play?: string;
      pause?: string;
      reset?: string;
      settings?: string;
      stats?: string;
    };
  }
}