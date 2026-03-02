import type { PropsWithChildren } from "react";
import { Paper, type PaperProps } from "@mui/material";
import { gameTokens } from "../../theme/tokens";

type PanelProps = PropsWithChildren<PaperProps>;

export const Panel = ({ children, sx, ...rest }: PanelProps) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: `${gameTokens.radius.lg}px`,
        boxShadow: gameTokens.shadow.panel,
        ...sx
      }}
      {...rest}
    >
      {children}
    </Paper>
  );
};
