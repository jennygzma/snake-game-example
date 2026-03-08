import { useEffect, useMemo, useState } from "react";
import { ThemeProvider, type Theme } from "@mui/material";
import { apiThemeService } from "../services/adapters/apiThemeService";
import { localThemeService } from "../services/storage/localThemeService";
import type { ThemeService } from "../services/themeService";
import { createThemeFromCustom } from "./themeFactory";
import { appTheme } from "./theme";

const resolveService = (): ThemeService => {
  const mode = import.meta.env.VITE_GAME_SERVICE_MODE;
  return mode === "local" ? localThemeService : apiThemeService;
};

type CustomThemeProviderProps = {
  children: React.ReactNode;
};

export const CustomThemeProvider = ({ children }: CustomThemeProviderProps) => {
  const service = useMemo(resolveService, []);
  const [theme, setTheme] = useState<Theme>(appTheme);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActiveTheme = async () => {
      try {
        const activeTheme = await service.getActiveTheme();
        if (activeTheme) {
          const customTheme = createThemeFromCustom(activeTheme);
          setTheme(customTheme);
        } else {
          // Use default theme if no active theme
          setTheme(appTheme);
        }
      } catch (error) {
        console.error("Failed to load active theme:", error);
        // Fallback to default theme on error
        setTheme(appTheme);
      } finally {
        setLoading(false);
      }
    };

    void loadActiveTheme();
  }, [service]);

  if (loading) {
    return null; // Or a loading spinner
  }

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};