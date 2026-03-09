import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button
} from "@mui/material";
import type { Profile } from "@snake/contracts";
import { useState } from "react";
import { useProfile } from "../../hooks/useProfile";

interface DeleteProfileDialogProps {
  open: boolean;
  profile: Profile | null;
  onClose: () => void;
}

export const DeleteProfileDialog = ({ open, profile, onClose }: DeleteProfileDialogProps) => {
  const { deleteProfile } = useProfile();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      const success = await deleteProfile(profile.id);
      if (success) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-profile-dialog-title"
      aria-describedby="delete-profile-dialog-description"
    >
      <DialogTitle id="delete-profile-dialog-title">Delete Profile?</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-profile-dialog-description">
          Are you sure you want to delete the profile "{profile?.name}"? This will permanently delete
          all associated custom themes and game scores. This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained" disabled={loading}>
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};