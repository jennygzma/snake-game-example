import { AppBar, Box, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { approvedIcons } from "../../theme/approvedIcons";
import { gameTokens } from "../../theme/tokens";

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}>
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: "none", color: "text.primary", fontWeight: 700 }}>
            Snake Game
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton
              component={Link}
              to="/stats"
              aria-label="Statistics"
              sx={{
                color: isActive("/stats") ? gameTokens.colors.action : "text.secondary",
                "&:hover": {
                  color: gameTokens.colors.action
                }
              }}
            >
              <approvedIcons.stats />
            </IconButton>
            <IconButton
              component={Link}
              to="/settings"
              aria-label="Settings"
              sx={{
                color: isActive("/settings") ? gameTokens.colors.action : "text.secondary",
                "&:hover": {
                  color: gameTokens.colors.action
                }
              }}
            >
              <approvedIcons.settings />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
};