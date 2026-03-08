import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { approvedIcons } from "../../theme/approvedIcons";
import { gameTokens } from "../../theme/tokens";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Snake Game
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              aria-label="Game"
              onClick={() => navigate("/")}
              sx={{
                color: isActive("/") ? gameTokens.colors.action : gameTokens.colors.text
              }}
            >
              <approvedIcons.game />
            </IconButton>
            <IconButton
              aria-label="Statistics"
              onClick={() => navigate("/stats")}
              sx={{
                color: isActive("/stats") ? gameTokens.colors.action : gameTokens.colors.text
              }}
            >
              <approvedIcons.stats />
            </IconButton>
            <IconButton
              aria-label="Settings"
              onClick={() => navigate("/settings")}
              sx={{
                color: isActive("/settings") ? gameTokens.colors.action : gameTokens.colors.text
              }}
            >
              <approvedIcons.settings />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
};