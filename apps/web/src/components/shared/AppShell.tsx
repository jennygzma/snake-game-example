import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { approvedIcons } from "../../theme/approvedIcons";

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: approvedIcons.home, label: "Game" },
    { path: "/stats", icon: approvedIcons.barChart, label: "Stats" },
    { path: "/settings", icon: approvedIcons.settings, label: "Settings" }
  ];

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Box
        component="nav"
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1000
        }}
        aria-label="Main navigation"
      >
        <Stack direction="row" spacing={1}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Tooltip key={item.path} title={item.label} placement="left">
                <IconButton
                  component={Link}
                  to={item.path}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  sx={{
                    bgcolor: isActive ? "action.selected" : "background.paper",
                    boxShadow: 2,
                    "&:hover": {
                      bgcolor: isActive ? "action.selected" : "action.hover"
                    }
                  }}
                >
                  <Icon />
                </IconButton>
              </Tooltip>
            );
          })}
        </Stack>
      </Box>
      <Box>{children}</Box>
    </Box>
  );
};