import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { Theme } from "@mui/material";
import type { CustomTheme } from "@snake/contracts";
import { createThemeFromCustom, getDefaultTheme } from "../theme/themeFactory";
import { apiThemeService } from "../services/adapters/apiThemeService";
import { localThemeService } from "../services/storage/localThemeService";

const USE_API = import.meta.env.VITE_USE_API === "true";
const themeService = USE_API ? apiThemeService : localThemeService;

interface ThemeContextValue {
  theme: Theme;
  activeCustomTheme: CustomTheme | null;
  setActiveCustomTheme: (theme: CustomTheme | null) => void;
  reloadTheme: () => Promise<void>;
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
  const [theme, setTheme] = useState<Theme>(getDefaultTheme());
  const [activeCustomTheme, setActiveCustomTheme] = useState<CustomTheme | null>(null);

  const reloadTheme = useCallback(async () => {
    try {
      const response = await themeService.getActiveTheme();
      if (response.theme) {
        setActiveCustomTheme(response.theme);
        setTheme(createThemeFromCustom(response.theme));
      } else {
        setActiveCustomTheme(null);
        setTheme(getDefaultTheme());
      }
    } catch (error) {
      console.error("Failed to reload theme:", error);
      setActiveCustomTheme(null);
      setTheme(getDefaultTheme());
    }
  }, []);

  // Load active theme on mount
  useEffect(() => {
    void reloadTheme();
  }, [reloadTheme]);

  // Update theme whenever activeCustomTheme changes
  useEffect(() => {
    if (activeCustomTheme) {
      setTheme(createThemeFromCustom(activeCustomTheme));
    } else {
      setTheme(getDefaultTheme());
    }
  }, [activeCustomTheme]);

  return (
    <ThemeContext.Provider value={{ theme, activeCustomTheme, setActiveCustomTheme, reloadTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
