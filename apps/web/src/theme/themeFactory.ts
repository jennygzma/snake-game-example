import { createTheme, type Theme } from "@mui/material";
import type { CustomTheme } from "@snake/contracts";
import { accessibilityTokens, gameTokens } from "./tokens";
import "./themeExtensions";

const hexToRgba = (hex: string, alpha: number, fallback: string): string => {
  const normalized = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return fallback;

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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
    ui: {
      nav: {
        topBarBg: colors.panel,
        topBarBorder: colors.panelBorder,
        topBarShadow: gameTokens.shadow.panel,
        profileHoverBg: hexToRgba(colors.text, 0.08, "rgba(0, 0, 0, 0.08)"),
        profileAvatarBg: colors.action,
        profileNameText: colors.text,
        iconActiveColor: colors.action,
        iconInactiveColor: colors.textMuted,
        iconLabelColor: colors.textMuted,
        tooltipBg: colors.text,
        tooltipText: colors.panel
      },
      feedback: {
        errorText: colors.danger,
        errorBg: hexToRgba(colors.danger, 0.1, "rgba(170, 44, 44, 0.1)"),
        errorBorder: hexToRgba(colors.danger, 0.35, "rgba(170, 44, 44, 0.35)")
      },
      profile: {
        activeChipBg: colors.action,
        activeChipText: colors.actionText,
        deleteButtonBg: colors.danger,
        deleteButtonHoverBg: colors.dangerHover,
        deleteButtonText: colors.dangerText
      },
      settings: {
        errorText: colors.danger
      },
      profileCard: {
        avatarBg: colors.action
      },
      profilePicker: {
        newCardBorder: colors.panelBorder,
        newCardHoverBorder: colors.action,
        newCardHoverBg: hexToRgba(colors.action, 0.1, "rgba(0, 0, 0, 0.06)"),
        mutedText: colors.textMuted
      },
      avatarUpload: {
        avatarBg: colors.action,
        helperText: colors.textMuted,
        errorText: colors.danger,
        deleteIcon: colors.danger
      },
      dialog: {
        descriptionText: colors.textMuted,
        warningBg: hexToRgba(colors.danger, 0.1, "rgba(170, 44, 44, 0.1)"),
        warningBorder: hexToRgba(colors.danger, 0.35, "rgba(170, 44, 44, 0.35)"),
        warningTitle: colors.danger,
        warningBody: colors.textMuted,
        destructiveButtonBg: colors.danger,
        destructiveButtonHoverBg: colors.dangerHover
      },
      leaderboard: {
        mutedText: colors.textMuted,
        divider: colors.panelBorder
      },
      stats: {
        tabsBorder: colors.panelBorder
      },
      shared: {
        panelBorder: colors.panelBorder
      },
      statCard: {
        labelText: colors.textMuted
      },
      gameBoard: {
        border: colors.panelBorder
      },
      themeGallery: {
        mutedText: colors.textMuted,
        swatchBorder: colors.panelBorder,
        activeChipBg: colors.action,
        activeChipText: colors.actionText,
        appliedChipBg: colors.snake,
        appliedChipText: colors.actionText
      },
      colorPicker: {
        swatchBorder: colors.panelBorder,
        swatchFocusRing: accessibilityTokens.colors.focusRing
      }
    },
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
    ui: {
      nav: {
        topBarBg: gameTokens.colors.panel,
        topBarBorder: gameTokens.colors.panelBorder,
        topBarShadow: gameTokens.shadow.panel,
        profileHoverBg: "rgba(23, 32, 24, 0.08)",
        profileAvatarBg: gameTokens.colors.action,
        profileNameText: gameTokens.colors.text,
        iconActiveColor: gameTokens.colors.action,
        iconInactiveColor: gameTokens.colors.textMuted,
        iconLabelColor: gameTokens.colors.textMuted,
        tooltipBg: gameTokens.colors.text,
        tooltipText: gameTokens.colors.panel
      },
      feedback: {
        errorText: gameTokens.colors.danger,
        errorBg: "rgba(170, 44, 44, 0.1)",
        errorBorder: "rgba(170, 44, 44, 0.35)"
      },
      profile: {
        activeChipBg: gameTokens.colors.action,
        activeChipText: gameTokens.colors.actionText,
        deleteButtonBg: gameTokens.colors.danger,
        deleteButtonHoverBg: gameTokens.colors.dangerHover,
        deleteButtonText: gameTokens.colors.dangerText
      },
      settings: {
        errorText: gameTokens.colors.danger
      },
      profileCard: {
        avatarBg: gameTokens.colors.action
      },
      profilePicker: {
        newCardBorder: gameTokens.colors.panelBorder,
        newCardHoverBorder: gameTokens.colors.action,
        newCardHoverBg: "rgba(31, 109, 47, 0.1)",
        mutedText: gameTokens.colors.textMuted
      },
      avatarUpload: {
        avatarBg: gameTokens.colors.action,
        helperText: gameTokens.colors.textMuted,
        errorText: gameTokens.colors.danger,
        deleteIcon: gameTokens.colors.danger
      },
      dialog: {
        descriptionText: gameTokens.colors.textMuted,
        warningBg: "rgba(170, 44, 44, 0.1)",
        warningBorder: "rgba(170, 44, 44, 0.35)",
        warningTitle: gameTokens.colors.danger,
        warningBody: gameTokens.colors.textMuted,
        destructiveButtonBg: gameTokens.colors.danger,
        destructiveButtonHoverBg: gameTokens.colors.dangerHover
      },
      leaderboard: {
        mutedText: gameTokens.colors.textMuted,
        divider: gameTokens.colors.panelBorder
      },
      stats: {
        tabsBorder: gameTokens.colors.panelBorder
      },
      shared: {
        panelBorder: gameTokens.colors.panelBorder
      },
      statCard: {
        labelText: gameTokens.colors.textMuted
      },
      gameBoard: {
        border: gameTokens.colors.panelBorder
      },
      themeGallery: {
        mutedText: gameTokens.colors.textMuted,
        swatchBorder: gameTokens.colors.panelBorder,
        activeChipBg: gameTokens.colors.action,
        activeChipText: gameTokens.colors.actionText,
        appliedChipBg: gameTokens.colors.snake,
        appliedChipText: gameTokens.colors.actionText
      },
      colorPicker: {
        swatchBorder: gameTokens.colors.panelBorder,
        swatchFocusRing: accessibilityTokens.colors.focusRing
      }
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
