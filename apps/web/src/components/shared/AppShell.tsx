import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Avatar, Box, Container, IconButton, Toolbar, useTheme } from "@mui/material";
import { approvedIcons } from "../../theme/approvedIcons";
import { NavIconButton } from "./NavIconButton";
import { useProfile } from "../../hooks/useProfile";

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { activeProfile } = useProfile();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" color="default" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between", gap: 1 }}>
            <IconButton
              onClick={() => navigate("/profile")}
              aria-label={`Profile: ${activeProfile?.name || "Unknown"}`}
              sx={{ gap: 1 }}
            >
              {activeProfile?.avatarBase64 ? (
                <Avatar src={activeProfile.avatarBase64} alt={activeProfile.name} sx={{ width: 32, height: 32 }} />
              ) : (
                <approvedIcons.accountCircle sx={{ fontSize: 32 }} />
              )}
            </IconButton>

            <Box sx={{ display: "flex", gap: 1 }}>
            <NavIconButton
              label="Game"
              active={location.pathname === "/"}
              onClick={() => navigate("/")}
              icon={<approvedIcons.sportsEsports />}
              inactiveColor={theme.icons.default}
            />
            <NavIconButton
              label="Statistics"
              active={location.pathname === "/stats"}
              onClick={() => navigate("/stats")}
              icon={<approvedIcons.barChart />}
              inactiveColor={theme.icons.stats || theme.icons.default}
            />
            <NavIconButton
              label="Settings"
              active={location.pathname === "/settings"}
              onClick={() => navigate("/settings")}
              icon={<approvedIcons.settings />}
              inactiveColor={theme.icons.settings || theme.icons.default}
            />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
};
