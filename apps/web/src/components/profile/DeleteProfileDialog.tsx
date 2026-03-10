import { useState } from "react";
import {
  DialogContentText,
  Typography,
  Box
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Profile } from "@snake/contracts";
import { approvedIcons } from "../../theme/approvedIcons";
import { AppDialogShell } from "../shared/AppDialogShell";
import { IconActionButton } from "../shared/IconActionButton";

const WarningIcon = approvedIcons.warning;

interface DeleteProfileDialogProps {
  open: boolean;
  profile: Profile | null;
  onClose: () => void;
  onDelete: (profileId: string) => Promise<void>;
}

export const DeleteProfileDialog = ({ open, profile, onClose, onDelete }: DeleteProfileDialogProps) => {
  const theme = useTheme();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!profile) return;

    setIsDeleting(true);
    try {
      await onDelete(profile.id);
      onClose();
    } catch (err) {
      console.error("Failed to delete profile:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <AppDialogShell
      open={open}
      onClose={handleClose}
      title={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon sx={{ color: theme.icons.warning || theme.ui.dialog.warningTitle }} />
          <span>Delete Profile?</span>
        </Box>
      }
      titleId="delete-profile-dialog-title"
      descriptionId="delete-profile-dialog-description"
      actions={
        <>
          <IconActionButton
            tone="neutral"
            variant="text"
            icon={<approvedIcons.close />}
            iconColor={theme.icons.close || theme.icons.default}
            label="Cancel"
            onClick={handleClose}
            disabled={isDeleting}
          />
          <IconActionButton
            tone="danger"
            variant="contained"
            icon={<approvedIcons.delete />}
            iconColor={theme.icons.delete || theme.icons.default}
            label={isDeleting ? "Deleting..." : "Delete Profile"}
            onClick={handleDelete}
            disabled={isDeleting}
            sx={{
              bgcolor: theme.ui.dialog.destructiveButtonBg,
              "&:hover": { bgcolor: theme.ui.dialog.destructiveButtonHoverBg }
            }}
          />
        </>
      }
    >
      <DialogContentText id="delete-profile-dialog-description">
        Are you sure you want to delete <strong>{profile?.name}</strong>?
      </DialogContentText>
      <Box
        sx={{
          mt: 2,
          p: 2,
          bgcolor: theme.ui.dialog.warningBg,
          borderRadius: 1,
          border: 1,
          borderColor: theme.ui.dialog.warningBorder
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.ui.dialog.warningTitle }}>
          This action cannot be undone.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: theme.ui.dialog.warningBody }}>
          Deleting this profile will also delete:
        </Typography>
        <Typography component="ul" variant="body2" sx={{ mt: 0.5, mb: 0, pl: 2, color: theme.ui.dialog.warningBody }}>
          <li>All custom themes</li>
          <li>All game scores and history</li>
        </Typography>
      </Box>
    </AppDialogShell>
  );
};
