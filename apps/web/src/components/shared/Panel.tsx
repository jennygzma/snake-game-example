import type { PropsWithChildren } from "react";
import { Paper, type PaperProps } from "@mui/material";

type PanelProps = PropsWithChildren<PaperProps>;

export const Panel = ({ children, sx, ...rest }: PanelProps) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: (theme) => theme.ui.shared.panelBorder,
        borderRadius: (theme) => `${theme.shape.borderRadius}px`,
        ...sx
      }}
      {...rest}
    >
      {children}
    </Paper>
  );
};
