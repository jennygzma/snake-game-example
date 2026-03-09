import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Box, Container, Toolbar, useTheme } from "@mui/material";
import { approvedIcons } from "../../theme/approvedIcons";
import { NavIconButton } from "./NavIconButton";

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
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
};
