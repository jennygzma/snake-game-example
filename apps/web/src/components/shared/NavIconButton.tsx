import type { ReactNode } from "react";
import { IconButton, Tooltip, useTheme } from "@mui/material";

type NavIconButtonProps = {
  label: string;
  active?: boolean;
  onClick: () => void;
  icon: ReactNode;
  activeColor?: string;
  inactiveColor?: string;
};

export const NavIconButton = ({
  label,
  active = false,
  onClick,
  icon,
  activeColor,
  inactiveColor
}: NavIconButtonProps) => {
  const theme = useTheme();
  const iconColor = active
    ? activeColor ?? theme.icons.active ?? theme.ui.nav.iconActiveColor
    : inactiveColor ?? theme.ui.nav.iconInactiveColor;

  return (
    <Tooltip
      title={label}
      arrow
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: theme.ui.nav.tooltipBg,
            color: theme.ui.nav.tooltipText,
            fontWeight: 600
          }
        }
      }}
    >
      <IconButton
        aria-label={label}
        onClick={onClick}
        size="large"
        sx={{
          color: iconColor,
          borderRadius: 2,
          p: 1
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};
