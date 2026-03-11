import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Theme } from "@mui/material";
import type { CustomTheme } from "@snake/contracts";
import { createThemeFromCustom, getDefaultTheme } from "../theme/themeFactory";
import { apiThemeService } from "../services/adapters/apiThemeService";
import { localThemeService } from "../services/storage/localThemeService";
import { useAppProfile } from "./ProfileContext";

const USE_API = import.meta.env.VITE_GAME_SERVICE_MODE !== "local";
const themeService = USE_API ? apiThemeService : localThemeService;

interface ThemeContextValue {
  theme: Theme;
  activeCustomTheme: CustomTheme | null;
  setActiveCustomTheme: (theme: CustomTheme | null) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { activeProfile } = useAppProfile();
  const [theme, setTheme] = useState<Theme>(getDefaultTheme());
  const [activeCustomTheme, setActiveCustomTheme] = useState<CustomTheme | null>(null);

  // Load active theme when active profile changes
  useEffect(() => {
    const loadActiveTheme = async () => {
      try {
        const response = await themeService.getActiveTheme();
        if (response.theme) {
          setActiveCustomTheme(response.theme);
          setTheme(createThemeFromCustom(response.theme));
        } else {
          // No active theme for this profile, use default
          setActiveCustomTheme(null);
          setTheme(getDefaultTheme());
        }
      } catch (error) {
        console.error("Failed to load active theme:", error);
        // Fall back to default theme on error
        setActiveCustomTheme(null);
        setTheme(getDefaultTheme());
      }
    };

    // Only load theme if we have an active profile
    if (activeProfile) {
      loadActiveTheme();
    } else {
      // No active profile, reset to default
      setActiveCustomTheme(null);
      setTheme(getDefaultTheme());
    }
  }, [activeProfile]);

  // Update theme whenever activeCustomTheme changes
  useEffect(() => {
    if (activeCustomTheme) {
      setTheme(createThemeFromCustom(activeCustomTheme));
    } else {
      setTheme(getDefaultTheme());
    }
  }, [activeCustomTheme]);

  return (
    <ThemeContext.Provider value={{ theme, activeCustomTheme, setActiveCustomTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
