import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { AvatarUpload } from "./AvatarUpload";

interface CreateProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateProfileDialog = ({ open, onClose }: CreateProfileDialogProps) => {
  const { createProfile } = useProfile();
  const [name, setName] = useState("");
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (name.length > 40) {
      setError("Name must be 40 characters or less");
      return;
    }

    setLoading(true);
    try {
      const profile = await createProfile({
        name: name.trim(),
        avatarBase64: avatarBase64 || undefined
      });

      if (profile) {
        handleClose();
      } else {
        setError("Failed to create profile");
      }
    } catch (err) {
      setError("Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setAvatarBase64(null);
    setError(null);
    setLoading(false);
    onClose();
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
        <TextField
          autoFocus
          margin="dense"
          label="Profile Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!error}
          helperText={error || "Enter a name for this profile (1-40 characters)"}
          inputProps={{ maxLength: 40 }}
        />
        <AvatarUpload value={avatarBase64} onChange={setAvatarBase64} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
