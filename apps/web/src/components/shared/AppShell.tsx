import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Box, Container, Toolbar, useTheme, Avatar, IconButton, Typography, Stack } from "@mui/material";
import { approvedIcons } from "../../theme/approvedIcons";
import { NavIconButton } from "./NavIconButton";
import { useProfileContext } from "../../contexts/ProfileContext";

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { activeProfile } = useProfileContext();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" color="default" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between", gap: 2 }}>
            {/* Profile button on the left */}
            <IconButton
              onClick={() => navigate("/profile")}
              sx={{
                gap: 1.5,
                px: 1.5,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "action.hover"
                }
              }}
              aria-label="View profile"
            >
              {activeProfile?.avatarBase64 ? (
                <Avatar
                  src={activeProfile.avatarBase64}
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <approvedIcons.accountCircle sx={{ width: 32, height: 32, color: "text.secondary" }} />
              )}
              <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
                {activeProfile?.name || "Profile"}
              </Typography>
            </IconButton>

            {/* Navigation buttons on the right */}
            <Stack direction="row" spacing={1}>
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
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
};
