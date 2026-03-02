import { createTheme } from "@mui/material";
import { accessibilityTokens, gameTokens } from "./tokens";

export const appTheme = createTheme({
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
      main: gameTokens.colors.danger
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
