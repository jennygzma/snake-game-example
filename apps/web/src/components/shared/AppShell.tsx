import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Box, Container, Toolbar, useTheme, IconButton, Typography } from "@mui/material";
import { approvedIcons } from "../../theme/approvedIcons";
import { NavIconButton } from "./NavIconButton";
import { useProfile } from "../../hooks/useProfile";
import { ProfileAvatar } from "./ProfileAvatar";

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
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          bgcolor: theme.ui.nav.topBarBg,
          borderBottom: "1px solid",
          borderColor: theme.ui.nav.topBarBorder,
          boxShadow: theme.ui.nav.topBarShadow
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 1 }}>
            <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
              <NavIconButton
                label="Game"
                active={location.pathname === "/"}
                onClick={() => navigate("/")}
                icon={<approvedIcons.sportsEsports />}
                activeColor={theme.icons.gameActive ?? theme.icons.active ?? theme.ui.nav.iconActiveColor}
                inactiveColor={theme.icons.sportsEsports || theme.icons.play || theme.icons.default}
              />
              <NavIconButton
                label="Statistics"
                active={location.pathname === "/stats"}
                onClick={() => navigate("/stats")}
                icon={<approvedIcons.barChart />}
                activeColor={theme.icons.statsActive ?? theme.icons.active ?? theme.ui.nav.iconActiveColor}
                inactiveColor={theme.icons.barChart || theme.icons.stats || theme.icons.default}
              />
              <NavIconButton
                label="Design"
                active={location.pathname === "/design"}
                onClick={() => navigate("/design")}
                icon={<approvedIcons.edit />}
                activeColor={theme.icons.settingsActive ?? theme.icons.active ?? theme.ui.nav.iconActiveColor}
                inactiveColor={theme.icons.settings || theme.icons.default}
              />
              <NavIconButton
                label="Hub"
                active={location.pathname === "/hub"}
                onClick={() => navigate("/hub")}
                icon={<approvedIcons.explore />}
                activeColor={theme.icons.active ?? theme.ui.nav.iconActiveColor}
                inactiveColor={theme.icons.explore || theme.icons.default}
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
                      bgcolor: theme.ui.nav.profileHoverBg
                    }
                  }}
                  aria-label="View profile"
                >
                  <ProfileAvatar
                    src={activeProfile.avatarBase64 || undefined}
                    size={32}
                    iconSize={24}
                    bgColor={theme.ui.nav.profileAvatarBg}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: theme.ui.nav.profileNameText,
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
