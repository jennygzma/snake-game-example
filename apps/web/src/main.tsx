import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider as MuiThemeProvider, Box, CircularProgress } from "@mui/material";
import { ProfileProvider } from "./contexts/ProfileContext";
import { ThemeProvider, useAppTheme } from "./contexts/ThemeContext";
import { useProfile } from "./hooks/useProfile";
import { AppShell } from "./components/shared/AppShell";
import { ProfilePicker } from "./components/profile/ProfilePicker";
import { GamePage } from "./pages/GamePage";
import { SettingsPage } from "./pages/SettingsPage";
import { StatsPage } from "./pages/StatsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { HubPage } from "./pages/HubPage";

const AppContent = () => {
  const { theme } = useAppTheme();
  const { activeProfile, isLoading, profiles, activateProfile, createProfile } = useProfile();

  // Show loading spinner while checking for active profile
  if (isLoading) {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh"
          }}
        >
          <CircularProgress />
        </Box>
      </MuiThemeProvider>
    );
  }

  // Show ProfilePicker if no active profile
  if (!activeProfile) {
    const handleSelectProfile = async (profile: typeof profiles[0]) => {
      await activateProfile(profile.id);
    };

    const handleCreateProfile = async (name: string, avatarBase64: string | null) => {
      const newProfile = await createProfile({
        name,
        ...(avatarBase64 ? { avatarBase64 } : {})
      });
      await activateProfile(newProfile.id);
    };

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <ProfilePicker 
          profiles={profiles}
          onSelectProfile={handleSelectProfile}
          onCreateProfile={handleCreateProfile}
        />
      </MuiThemeProvider>
    );
  }

  // Show normal app with AppShell when profile is active
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<GamePage />} />
            <Route path="/design" element={<SettingsPage />} />
            <Route path="/settings" element={<Navigate to="/design" replace />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/hub" element={<HubPage />} />
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
