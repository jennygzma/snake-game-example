import { useState, useEffect, useMemo } from "react";
import { createTheme, Theme } from "@mui/material/styles";
import type { CustomTheme } from "@snake/contracts";
import { localThemeService } from "../services/storage/localThemeService";
import { apiThemeService } from "../services/adapters/apiThemeService";
import { gameTokens, accessibilityTokens } from "../theme/tokens";

const resolveService = () => {
  const mode = import.meta.env.VITE_GAME_SERVICE_MODE;
  return mode === "local" ? localThemeService : apiThemeService;
};

const createThemeFromCustom = (customTheme: CustomTheme | null): Theme => {
  if (!customTheme) {
    // Return default theme
    return createTheme({
      typography: {
        fontFamily: "'Space Grotesk', 'Avenir Next', 'Segoe UI', sans-serif"
      },
      palette: {
        mode: "light",
        background: {
          default: gameTokens.colors.bg,
          paper: gameTokens.colors.panel
        },
        primary: {
          main: gameTokens.colors.action
        },
        text: {
          primary: gameTokens.colors.text,
          secondary: gameTokens.colors.textMuted
        }
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: gameTokens.colors.bg
            }
          }
        }
      }
    });
  }

  // Create MUI theme from CustomTheme
  return createTheme({
    typography: {
      fontFamily: customTheme.fontFamily
    },
    palette: {
      mode: "light",
      background: {
        default: customTheme.colors.bg,
        paper: customTheme.colors.panel
      },
      primary: {
        main: customTheme.colors.action
      },
      secondary: {
        main: customTheme.colors.pause
      },
      error: {
        main: customTheme.colors.danger
      },
      text: {
        primary: customTheme.colors.text,
        secondary: customTheme.colors.textMuted
      },
      divider: customTheme.colors.panelBorder
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: customTheme.colors.bg,
            color: customTheme.colors.text
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          contained: {
            backgroundColor: customTheme.colors.action,
            color: customTheme.colors.actionText,
            "&:hover": {
              backgroundColor: customTheme.colors.actionHover
            }
          }
        }
      }
    }
  });
};

export const useActiveTheme = () => {
  const [customTheme, setCustomTheme] = useState<CustomTheme | null>(null);
  const [loading, setLoading] = useState(true);
  const service = useMemo(resolveService, []);

  const loadActiveTheme = async () => {
    try {
      setLoading(true);
      const response = await service.getActiveTheme();
      setCustomTheme(response.theme);
    } catch (err) {
      console.error("Failed to load active theme:", err);
      setCustomTheme(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActiveTheme();
  }, []);

  const theme = useMemo(() => createThemeFromCustom(customTheme), [customTheme]);

  const refreshTheme = () => {
    loadActiveTheme();
  };

  return { theme, customTheme, loading, refreshTheme };
};