import { createTheme, type Theme } from "@mui/material";
import type { CustomTheme } from "@snake/contracts";
import { accessibilityTokens } from "./tokens";

export const createAppTheme = (customTheme?: CustomTheme | null): Theme => {
  // Use custom theme colors if provided, otherwise use defaults
  const colors = customTheme?.colors ?? {
    bg: "#eff3e9",
    panel: "#f9fbf6",
    panelBorder: "#d6dec8",
    text: "#172018",
    textMuted: "#607064",
    snake: "#1f6d2f",
    snakeHead: "#0d4f20",
    food: "#f15a24",
    boardGrid: "rgba(20, 30, 20, 0.08)",
    boardBg: "#edf3e4",
    action: "#1f6d2f",
    actionHover: "#165425",
    actionText: "#f7fbf4",
    pause: "#8c3f00",
    pauseHover: "#733300",
    pauseText: "#fffaf4",
    neutral: "#d5ddce",
    neutralHover: "#c6cebf",
    neutralText: "#172018",
    danger: "#aa2c2c",
    dangerHover: "#8f1f1f",
    dangerText: "#fff7f7"
  };

  const fontFamily = customTheme?.fontFamily ?? "'Space Grotesk', 'Avenir Next', 'Segoe UI', sans-serif";

  return createTheme({
    palette: {
      mode: "light",
      primary: {
        main: colors.action,
        contrastText: colors.actionText
      },
      secondary: {
        main: colors.pause,
        contrastText: colors.pauseText
      },
      error: {
        main: colors.danger
      },
      background: {
        default: colors.bg,
        paper: colors.panel
      },
      text: {
        primary: colors.text,
        secondary: colors.textMuted
      },
      divider: colors.panelBorder
    },
    shape: {
      borderRadius: 14
    },
    typography: {
      fontFamily,
      h4: {
        fontWeight: 700,
        letterSpacing: "0.01em"
      },
      h5: {
        fontWeight: 700
      },
      button: {
        fontWeight: 700,
        letterSpacing: "0.03em"
      }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ":root": {
            colorScheme: "light"
          },
          "*:focus-visible": {
            outline: `${accessibilityTokens.focus.outlineWidth} ${accessibilityTokens.focus.outlineStyle} ${accessibilityTokens.colors.focusRing}`,
            outlineOffset: accessibilityTokens.focus.outlineOffset
          },
          "@media (prefers-reduced-motion: reduce)": {
            "*, *::before, *::after": {
              animationDuration: "0.001ms !important",
              animationIterationCount: "1 !important",
              transitionDuration: "0.001ms !important",
              scrollBehavior: "auto !important"
            }
          }
        }
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            "&:focus-visible": {
              outline: "none",
              boxShadow: `${accessibilityTokens.shadow.focusRing}, inset 0 1px 0 rgba(255,255,255,0.4)`
            }
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: "0 6px 18px rgba(26, 42, 26, 0.12)"
          }
        }
      }
    }
  });
};