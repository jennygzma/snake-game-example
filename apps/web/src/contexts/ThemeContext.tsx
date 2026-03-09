import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Theme } from "@mui/material";
import type { CustomTheme } from "@snake/contracts";
import { createThemeFromCustom, getDefaultTheme } from "../theme/themeFactory";
import { apiThemeService } from "../services/adapters/apiThemeService";
import { localThemeService } from "../services/storage/localThemeService";
import { useProfileContext } from "./ProfileContext";

const USE_API = import.meta.env.VITE_USE_API === "true";
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
  const { activeProfile } = useProfileContext();
  const [theme, setTheme] = useState<Theme>(getDefaultTheme());
  const [activeCustomTheme, setActiveCustomTheme] = useState<CustomTheme | null>(null);

  // Load active theme when profile changes
  useEffect(() => {
    const loadActiveTheme = async () => {
      if (!activeProfile) {
        // No active profile - use default theme
        setActiveCustomTheme(null);
        setTheme(getDefaultTheme());
        return;
      }

      try {
        const response = await themeService.getActiveTheme();
        if (response.theme) {
          setActiveCustomTheme(response.theme);
          setTheme(createThemeFromCustom(response.theme));
        } else {
          // Profile has no active theme - use default
          setActiveCustomTheme(null);
          setTheme(getDefaultTheme());
        }
      } catch (error) {
        console.error("Failed to load active theme:", error);
        setTheme(getDefaultTheme());
      }
    };

    loadActiveTheme();
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