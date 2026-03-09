import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box
} from "@mui/material";
import { Warning } from "@mui/icons-material";
import type { Profile } from "@snake/contracts";

interface DeleteProfileDialogProps {
  open: boolean;
  profile: Profile | null;
  onClose: () => void;
  onDelete: (profileId: string) => Promise<void>;
}

export const DeleteProfileDialog = ({ open, profile, onClose, onDelete }: DeleteProfileDialogProps) => {
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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="delete-profile-dialog-title"
      aria-describedby="delete-profile-dialog-description"
    >
      <DialogTitle id="delete-profile-dialog-title">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Warning color="error" />
          <span>Delete Profile?</span>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-profile-dialog-description">
          Are you sure you want to delete <strong>{profile?.name}</strong>?
        </DialogContentText>
        <Box sx={{ mt: 2, p: 2, bgcolor: "error.50", borderRadius: 1, border: 1, borderColor: "error.200" }}>
          <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
            This action cannot be undone.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Deleting this profile will also delete:
          </Typography>
          <Typography component="ul" variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 0, pl: 2 }}>
            <li>All custom themes</li>
            <li>All game scores and history</li>
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Profile"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};