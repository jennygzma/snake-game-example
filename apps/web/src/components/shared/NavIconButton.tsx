import type { ReactNode } from "react";
import { IconButton, useTheme } from "@mui/material";

type NavIconButtonProps = {
  label: string;
  active?: boolean;
  onClick: () => void;
  icon: ReactNode;
  inactiveColor?: string;
};

export const NavIconButton = ({ label, active = false, onClick, icon, inactiveColor }: NavIconButtonProps) => {
  const theme = useTheme();

  return (
    <IconButton
      aria-label={label}
      onClick={onClick}
      color={active ? "primary" : "default"}
      size="large"
      sx={{
        color: active ? undefined : inactiveColor ?? theme.icons.default
      }}
    >
      {icon}
    </IconButton>
  );
};
