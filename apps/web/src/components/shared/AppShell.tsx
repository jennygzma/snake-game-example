import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Box, Container, Toolbar, useTheme, IconButton, Avatar, Typography } from "@mui/material";
import { approvedIcons } from "../../theme/approvedIcons";
import { NavIconButton } from "./NavIconButton";
import { useProfile } from "../../hooks/useProfile";

const AccountCircleIcon = approvedIcons.accountCircle;

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
          <Toolbar disableGutters sx={{ gap: 1 }}>
            <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
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
                <IconButton
                  onClick={() => navigate("/profile")}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    borderRadius: 2,
                    px: 1.5,
                    "&:hover": {
                      bgcolor: "action.hover"
                    }
                  }}
                  aria-label="View profile"
                >
                  <Avatar
                    src={activeProfile.avatarBase64 || undefined}
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "primary.main"
                    }}
                  >
                    {!activeProfile.avatarBase64 && <AccountCircleIcon sx={{ width: 24, height: 24 }} />}
                  </Avatar>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      display: { xs: "none", sm: "block" }
                    }}
                  >
                    {activeProfile.name}
                  </Typography>
                </IconButton>
              )}
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
