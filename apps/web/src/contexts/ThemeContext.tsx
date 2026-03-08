import { createContext, useContext, ReactNode } from "react";
import { Theme } from "@mui/material/styles";
import type { CustomTheme } from "@snake/contracts";

interface ThemeContextValue {
  theme: Theme;
  customTheme: CustomTheme | null;
  refreshTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeContextProvider = ({
  children,
  value
}: {
  children: ReactNode;
  value: ThemeContextValue;
}) => {
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeContextProvider");
  }
  return context;
};