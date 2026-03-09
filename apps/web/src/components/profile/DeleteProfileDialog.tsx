import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography
} from "@mui/material";
import type { Profile } from "@snake/contracts";

interface DeleteProfileDialogProps {
  open: boolean;
  profile: Profile | null;
  onClose: () => void;
  onDelete: (profileId: string) => Promise<void>;
}

export const DeleteProfileDialog = ({
  open,
  profile,
  onClose,
  onDelete
}: DeleteProfileDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      setError(null);
      await onDelete(profile.id);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete profile");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="delete-profile-dialog-title"
      aria-describedby="delete-profile-dialog-description"
    >
      <DialogTitle id="delete-profile-dialog-title">Delete Profile?</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-profile-dialog-description">
          Are you sure you want to delete{" "}
          <Typography component="span" fontWeight="bold">
            {profile.name}
          </Typography>
          ?
        </DialogContentText>
        <DialogContentText sx={{ mt: 2 }}>
          This will permanently delete:
        </DialogContentText>
        <DialogContentText component="ul" sx={{ mt: 1 }}>
          <li>All custom themes</li>
          <li>All game scores and stats</li>
          <li>All profile settings</li>
        </DialogContentText>
        <DialogContentText sx={{ mt: 2, fontWeight: "bold", color: "error.main" }}>
          This action cannot be undone.
        </DialogContentText>
        {error && (
          <DialogContentText sx={{ mt: 2, color: "error.main" }}>{error}</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained" disabled={loading}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};