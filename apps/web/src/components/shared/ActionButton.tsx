import type { ReactNode } from "react";
import { Button, Tooltip, type ButtonProps, useMediaQuery, useTheme } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

type ActionTone = "play" | "pause" | "neutral" | "danger";

type ActionButtonProps = Omit<ButtonProps, "color" | "variant" | "startIcon"> & {
  tone?: ActionTone;
  icon?: ReactNode;
  responsiveIconOnly?: boolean;
  iconOnly?: boolean;
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

  // Dynamic tone styles based on current theme
  const toneStyles: Record<ActionTone, SxProps<Theme>> = {
    play: {
      bgcolor: theme.game.action,
      color: theme.game.actionText,
      "&:hover": { bgcolor: theme.game.actionHover }
    },
    pause: {
      bgcolor: theme.game.pause,
      color: theme.game.pauseText,
      "&:hover": { bgcolor: theme.game.pauseHover }
    },
    neutral: {
      bgcolor: theme.game.neutral,
      color: theme.game.neutralText,
      "&:hover": { bgcolor: theme.game.neutralHover }
    },
    danger: {
      bgcolor: theme.game.danger,
      color: theme.game.dangerText,
      "&:hover": { bgcolor: theme.game.dangerHover }
    }
  };

  if (import.meta.env.DEV && isIconOnly && !accessibleLabel) {
    // Icon-only controls need a text label for assistive technologies.
    // eslint-disable-next-line no-console
    console.warn("ActionButton: icon-only mode requires children text or aria-label.");
  }

  const content = (
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
          borderRadius: 1,
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

  if (!isIconOnly || !accessibleLabel) return content;

  return (
    <Tooltip title={accessibleLabel} arrow>
      <span>{content}</span>
    </Tooltip>
  );
};
