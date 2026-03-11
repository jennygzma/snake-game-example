import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { Box, Tooltip, useMediaQuery, useTheme, type Breakpoint } from "@mui/material";
import { AppButton, type AppButtonProps } from "./AppButton";

type IconActionButtonProps = Omit<AppButtonProps, "children" | "startIcon" | "aria-label"> & {
  icon: ReactNode;
  label: string;
  iconColor?: string;
  showLabelFrom?: Breakpoint;
  iconOnly?: boolean;
};

export const IconActionButton = ({
  icon,
  label,
  iconColor,
  showLabelFrom = "md",
  iconOnly = false,
  ...props
}: IconActionButtonProps) => {
  const theme = useTheme();
  const showLabel = !iconOnly && useMediaQuery(theme.breakpoints.up(showLabelFrom));
  const iconNode =
    iconColor && isValidElement(icon)
      ? cloneElement(icon as ReactElement<{ sx?: object }>, {
          sx: [{ color: iconColor }, (icon as ReactElement<{ sx?: object }>).props?.sx].filter(Boolean)
        })
      : icon;

  return (
    <Tooltip title={label} arrow disableHoverListener={showLabel}>
      <span>
        <AppButton
          {...props}
          aria-label={label}
          startIcon={iconNode}
          sx={[
            {
              minWidth: showLabel ? undefined : 44,
              px: showLabel ? undefined : 1,
              "& .MuiButton-startIcon": showLabel
                ? undefined
                : {
                    margin: 0
                  }
            },
            ...(Array.isArray(props.sx) ? props.sx : props.sx ? [props.sx] : [])
          ]}
        >
          <Box component="span" sx={{ display: showLabel ? "inline" : "none" }}>
            {label}
          </Box>
        </AppButton>
      </span>
    </Tooltip>
  );
};
