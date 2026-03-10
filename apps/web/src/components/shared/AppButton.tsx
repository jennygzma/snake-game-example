import type { ButtonProps } from "@mui/material";
import { Button, useTheme } from "@mui/material";

type AppButtonTone = "primary" | "neutral" | "danger";

export type AppButtonProps = Omit<ButtonProps, "color"> & {
  tone?: AppButtonTone;
};

export const AppButton = ({ tone = "primary", variant = "contained", sx, ...props }: AppButtonProps) => {
  const theme = useTheme();

  const toneStyles =
    variant === "contained"
      ? {
          primary: {
            bgcolor: theme.game.action,
            color: theme.game.actionText,
            "&:hover": { bgcolor: theme.game.actionHover }
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
        }
      : {
          primary: {
            color: theme.game.action,
            borderColor: theme.game.action
          },
          neutral: {
            color: theme.game.neutralText,
            borderColor: theme.game.neutral
          },
          danger: {
            color: theme.game.danger,
            borderColor: theme.game.danger
          }
        };

  return (
    <Button
      variant={variant}
      sx={[
        {
          fontWeight: 600,
          borderRadius: (muiTheme) => `${muiTheme.shape.borderRadius}px`
        },
        toneStyles[tone],
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
      {...props}
    />
  );
};
