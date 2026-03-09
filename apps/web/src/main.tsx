import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { ProfileProvider } from "./contexts/ProfileContext";
import { ThemeProvider, useAppTheme } from "./contexts/ThemeContext";
import { AppShell } from "./components/shared/AppShell";
import { GamePage } from "./pages/GamePage";
import { SettingsPage } from "./pages/SettingsPage";
import { StatsPage } from "./pages/StatsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ProfilePicker } from "./components/profile/ProfilePicker";
import { useProfileContext } from "./contexts/ProfileContext";

const AppContent = () => {
  const { theme } = useAppTheme();
  const { activeProfile, loading } = useProfileContext();

  // Show profile picker if no active profile
  if (!loading && !activeProfile) {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <ProfilePicker />
      </MuiThemeProvider>
    );
  }

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<GamePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </MuiThemeProvider>
  );
};

const App = () => {
  return (
    <ProfileProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ProfileProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);