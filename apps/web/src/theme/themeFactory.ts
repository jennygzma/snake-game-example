import { createTheme, type Theme } from "@mui/material";
import type { CustomTheme } from "@snake/contracts";
import { accessibilityTokens, gameTokens } from "./tokens";
import "./themeExtensions";

/**
 * Convert a CustomTheme to a Material-UI theme object
 */
export const createThemeFromCustom = (customTheme: CustomTheme): Theme => {
  const { colors, fontFamily, iconColors } = customTheme;

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
        main: colors.danger,
        contrastText: colors.dangerText
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
      borderRadius: gameTokens.radius.md
    },
    game: {
      snake: colors.snake,
      snakeHead: colors.snakeHead,
      food: colors.food,
      boardBg: colors.boardBg,
      boardGrid: colors.boardGrid,
      action: colors.action,
      actionHover: colors.actionHover,
      actionText: colors.actionText,
      pause: colors.pause,
      pauseHover: colors.pauseHover,
      pauseText: colors.pauseText,
      neutral: colors.neutral,
      neutralHover: colors.neutralHover,
      neutralText: colors.neutralText,
      danger: colors.danger,
      dangerHover: colors.dangerHover,
      dangerText: colors.dangerText
    },
    icons: iconColors,
    typography: {
      fontFamily: `'${fontFamily}', 'Space Grotesk', 'Avenir Next', 'Segoe UI', sans-serif`,
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
              boxShadow: `${accessibilityTokens.shadow.focusRing}, ${gameTokens.shadow.inset}`
            }
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: gameTokens.shadow.panel
          }
        }
      }
    }
  });
};

/**
 * Get default theme when no custom theme is active
 */
export const getDefaultTheme = (): Theme => {
  return createTheme({
    palette: {
      mode: "light",
      primary: {
        main: gameTokens.colors.action,
        contrastText: gameTokens.colors.actionText
      },
      secondary: {
        main: gameTokens.colors.pause,
        contrastText: gameTokens.colors.pauseText
      },
      error: {
        main: gameTokens.colors.danger,
        contrastText: gameTokens.colors.dangerText
      },
      background: {
        default: gameTokens.colors.bg,
        paper: gameTokens.colors.panel
      },
      text: {
        primary: gameTokens.colors.text,
        secondary: gameTokens.colors.textMuted
      },
      divider: gameTokens.colors.panelBorder
    },
    shape: {
      borderRadius: gameTokens.radius.md
    },
    game: {
      snake: gameTokens.colors.snake,
      snakeHead: gameTokens.colors.snakeHead,
      food: gameTokens.colors.food,
      boardBg: gameTokens.colors.boardBg,
      boardGrid: gameTokens.colors.boardGrid,
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
    icons: {
      default: "#ffffff"
    },
    typography: {
      fontFamily: "'Space Grotesk', 'Avenir Next', 'Segoe UI', sans-serif",
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
              boxShadow: `${accessibilityTokens.shadow.focusRing}, ${gameTokens.shadow.inset}`
            }
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: gameTokens.shadow.panel
          }
        }
      }
    }
  });
};