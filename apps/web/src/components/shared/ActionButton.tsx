import type { ReactNode } from "react";
import { Button, type ButtonProps, useMediaQuery, useTheme } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { gameTokens } from "../../theme/tokens";

type ActionTone = "play" | "pause" | "neutral" | "danger";

type ActionButtonProps = Omit<ButtonProps, "color" | "variant" | "startIcon"> & {
  tone?: ActionTone;
  icon?: ReactNode;
  responsiveIconOnly?: boolean;
  iconOnly?: boolean;
};

const toneStyles: Record<ActionTone, SxProps<Theme>> = {
  play: {
    bgcolor: gameTokens.colors.action,
    color: gameTokens.colors.actionText,
    "&:hover": { bgcolor: gameTokens.colors.actionHover }
  },
  pause: {
    bgcolor: gameTokens.colors.pause,
    color: gameTokens.colors.pauseText,
    "&:hover": { bgcolor: gameTokens.colors.pauseHover }
  },
  neutral: {
    bgcolor: gameTokens.colors.neutral,
    color: gameTokens.colors.neutralText,
    "&:hover": { bgcolor: gameTokens.colors.neutralHover }
  },
  danger: {
    bgcolor: gameTokens.colors.danger,
    color: gameTokens.colors.dangerText,
    "&:hover": { bgcolor: gameTokens.colors.dangerHover }
  }
};

export const ActionButton = ({
  tone = "play",
  icon,
  responsiveIconOnly = false,
  iconOnly = false,
  sx,
  children,
  ...props
}: ActionButtonProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isIconOnly = Boolean(icon) && (iconOnly || (responsiveIconOnly && isSmallScreen));
  const label = typeof children === "string" ? children : undefined;
  const accessibleLabel = props["aria-label"] ?? label;

  if (import.meta.env.DEV && isIconOnly && !accessibleLabel) {
    // Icon-only controls need a text label for assistive technologies.
    // eslint-disable-next-line no-console
    console.warn("ActionButton: icon-only mode requires children text or aria-label.");
  }

  return (
    <Button
      variant="contained"
      size="large"
      fullWidth={!isIconOnly}
      aria-label={isIconOnly ? accessibleLabel : props["aria-label"]}
      startIcon={!isIconOnly ? icon : undefined}
      sx={[
        {
          minHeight: 52,
          minWidth: isIconOnly ? 52 : undefined,
          px: isIconOnly ? 0 : 2.25,
          borderRadius: "12px",
          boxShadow: gameTokens.shadow.inset,
          fontWeight: 700
        },
        toneStyles[tone],
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
      {...props}
    >
      {isIconOnly ? icon : children}
    </Button>
  );
};
