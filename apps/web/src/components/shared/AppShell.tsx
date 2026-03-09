import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Box, Container, IconButton, Toolbar, useTheme } from "@mui/material";
import { approvedIcons } from "../../theme/approvedIcons";

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" color="default" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "flex-end", gap: 1 }}>
            <IconButton
              aria-label="Game"
              onClick={() => navigate("/")}
              color={location.pathname === "/" ? "primary" : "default"}
              size="large"
              sx={{
                color: location.pathname === "/" ? undefined : theme.icons.default
              }}
            >
              <approvedIcons.sportsEsports />
            </IconButton>
            <IconButton
              aria-label="Statistics"
              onClick={() => navigate("/stats")}
              color={location.pathname === "/stats" ? "primary" : "default"}
              size="large"
              sx={{
                color: location.pathname === "/stats" ? undefined : (theme.icons.stats || theme.icons.default)
              }}
            >
              <approvedIcons.barChart />
            </IconButton>
            <IconButton
              aria-label="Settings"
              onClick={() => navigate("/settings")}
              color={location.pathname === "/settings" ? "primary" : "default"}
              size="large"
              sx={{
                color: location.pathname === "/settings" ? undefined : (theme.icons.settings || theme.icons.default)
              }}
            >
              <approvedIcons.settings />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
};