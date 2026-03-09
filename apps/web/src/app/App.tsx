import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AppShell } from "../components/shared/AppShell";
import { GamePage } from "../pages/GamePage";
import { SettingsPage } from "../pages/SettingsPage";
import { StatsPage } from "../pages/StatsPage";
import { useActiveTheme } from "../hooks/useActiveTheme";
import { ThemeContextProvider } from "../contexts/ThemeContext";

export const App = () => {
  const { theme, customTheme, loading, refreshTheme } = useActiveTheme();

  if (loading) {
    return null;
  }

  return (
    <ThemeContextProvider value={{ theme, customTheme, refreshTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<GamePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/stats" element={<StatsPage />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </ThemeProvider>
    </ThemeContextProvider>
  );
};
