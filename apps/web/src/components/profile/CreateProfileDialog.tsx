import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack
} from "@mui/material";
import { AvatarUpload } from "./AvatarUpload";

interface CreateProfileDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, avatarBase64: string | null) => Promise<void>;
}

export const CreateProfileDialog = ({ open, onClose, onCreate }: CreateProfileDialogProps) => {
  const [name, setName] = useState("");
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (!loading) {
      setName("");
      setAvatarBase64(null);
      setError(null);
      onClose();
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (name.length > 40) {
      setError("Name must be 40 characters or less");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onCreate(name.trim(), avatarBase64);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="create-profile-dialog-title"
    >
      <DialogTitle id="create-profile-dialog-title">Create New Profile</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <AvatarUpload currentAvatar={avatarBase64} onAvatarChange={setAvatarBase64} />

          <TextField
            autoFocus
            label="Profile Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!error}
            helperText={error || "Max 40 characters"}
            inputProps={{ maxLength: 40 }}
            disabled={loading}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleCreate} variant="contained" disabled={loading || !name.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};