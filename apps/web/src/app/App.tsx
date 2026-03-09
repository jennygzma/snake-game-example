import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "../components/shared/AppShell";
import { GamePage } from "../pages/GamePage";
import { SettingsPage } from "../pages/SettingsPage";
import { StatsPage } from "../pages/StatsPage";

export const App = () => {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<GamePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
};
