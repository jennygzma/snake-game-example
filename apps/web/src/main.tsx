import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress, CssBaseline, ThemeProvider as MuiThemeProvider, Typography } from "@mui/material";
import { ThemeProvider, useAppTheme } from "./contexts/ThemeContext";
import { ProfileProvider } from "./contexts/ProfileContext";
import { useProfile } from "./hooks/useProfile";
import { AppShell } from "./components/shared/AppShell";
import { GamePage } from "./pages/GamePage";
import { SettingsPage } from "./pages/SettingsPage";
import { StatsPage } from "./pages/StatsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ProfilePicker } from "./components/profile/ProfilePicker";

const AppContent = () => {
  const { theme } = useAppTheme();
  const { activeProfile, loading } = useProfile();

  // Show loading state while profiles are being loaded
  if (loading) {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <CircularProgress aria-label="Loading profiles" />
          <Typography variant="body2" color="text.secondary">
            Loading profiles...
          </Typography>
        </Box>
      </MuiThemeProvider>
    );
  }

  // Show ProfilePicker if no active profile
  if (!activeProfile) {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <ProfilePicker />
        </BrowserRouter>
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
    <ThemeProvider>
      <ProfileProvider>
        <AppContent />
      </ProfileProvider>
    </ThemeProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
