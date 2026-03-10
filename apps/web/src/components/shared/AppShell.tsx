import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Box, Container, Toolbar, useTheme, Avatar, IconButton, Typography } from "@mui/material";
import { approvedIcons } from "../../theme/approvedIcons";
import { NavIconButton } from "./NavIconButton";
import { useProfile } from "../../hooks/useProfile";

interface AppShellProps {
  children: ReactNode;
}

const AccountCircleIcon = approvedIcons.accountCircle;

export const AppShell = ({ children }: AppShellProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { activeProfile } = useProfile();

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

            {activeProfile && (
              <Box sx={{ ml: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 1, height: 32, bgcolor: theme.palette.divider }} />
                <IconButton
                  onClick={() => navigate("/profile")}
                  aria-label={`Profile: ${activeProfile.name}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    borderRadius: "8px",
                    px: 1.5,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  <Avatar
                    src={activeProfile.avatarBase64 || undefined}
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: theme.palette.primary.main
                    }}
                  >
                    {!activeProfile.avatarBase64 && (
                      <AccountCircleIcon sx={{ fontSize: 32 }} />
                    )}
                  </Avatar>
                  <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
                    {activeProfile.name}
                  </Typography>
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
};
