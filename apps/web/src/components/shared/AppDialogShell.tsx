import type { ReactNode } from "react";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, type DialogProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";

type AppDialogShellProps = {
  open: boolean;
  onClose?: () => void;
  title: ReactNode;
  titleId: string;
  description?: ReactNode;
  descriptionId?: string;
  actions?: ReactNode;
  children?: ReactNode;
  maxWidth?: DialogProps["maxWidth"];
  fullWidth?: boolean;
  paperProps?: DialogProps["PaperProps"];
};

export const AppDialogShell = ({
  open,
  onClose,
  title,
  titleId,
  description,
  descriptionId,
  actions,
  children,
  maxWidth = "sm",
  fullWidth = true,
  paperProps
}: AppDialogShellProps) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      PaperProps={paperProps}
    >
      <DialogTitle id={titleId}>{title}</DialogTitle>
      <DialogContent>
        {description ? (
          <Box id={descriptionId} sx={{ color: theme.ui.dialog.descriptionText, fontSize: "0.875rem", mb: 2 }}>
            {description}
          </Box>
        ) : null}
        {children}
      </DialogContent>
      {actions ? <DialogActions>{actions}</DialogActions> : null}
    </Dialog>
  );
};
