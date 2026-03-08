import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type { CustomTheme } from "@snake/contracts";
import { AppShell } from "./components/shared/AppShell";
import { GamePage } from "./pages/GamePage";
import { SettingsPage } from "./pages/SettingsPage";
import { StatsPage } from "./pages/StatsPage";
import { apiThemeService } from "./services/adapters/apiThemeService";
import type { ThemeService } from "./services/themeService";
import { localThemeService } from "./services/storage/localThemeService";
import { createAppTheme } from "./theme/themeFactory";

const resolveService = (): ThemeService => {
  const mode = import.meta.env.VITE_GAME_SERVICE_MODE;
  return mode === "local" ? localThemeService : apiThemeService;
};

const App = () => {
  const [activeTheme, setActiveTheme] = useState<CustomTheme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const service = resolveService();
        const response = await service.getActiveTheme();
        setActiveTheme(response.theme);
      } catch (error) {
        console.error("Failed to load active theme:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  const theme = createAppTheme(activeTheme);

  if (loading) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppShell>
        <Routes>
          <Route path="/" element={<GamePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </AppShell>
    </ThemeProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
