import { createTheme, type Theme } from "@mui/material";
import type { CustomTheme } from "@snake/contracts";
import { accessibilityTokens, gameTokens } from "./tokens";

export const createThemeFromCustom = (customTheme: CustomTheme | null): Theme => {
  // Use custom theme colors if available, otherwise use default gameTokens
  const colors = customTheme?.colors ?? gameTokens.colors;
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
      borderRadius: gameTokens.radius.md
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