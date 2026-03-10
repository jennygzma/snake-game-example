import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from "@mui/material";
import type { CreateProfileInput } from "@snake/contracts";
import { AvatarUpload } from "./AvatarUpload";

interface CreateProfileDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: CreateProfileInput) => Promise<void>;
}

export const CreateProfileDialog = ({ open, onClose, onCreate }: CreateProfileDialogProps) => {
  const [name, setName] = useState("");
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (name.trim().length < 1 || name.trim().length > 40) {
      setError("Name must be between 1 and 40 characters");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onCreate({
        name: name.trim(),
        ...(avatarBase64 ? { avatarBase64 } : {})
      });
      setName("");
      setAvatarBase64(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setName("");
      setAvatarBase64(null);
      setError("");
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="create-profile-dialog-title"
      aria-describedby="create-profile-dialog-description"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle id="create-profile-dialog-title">Create Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
            <Box id="create-profile-dialog-description" sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
              Create a new profile name and optional avatar.
            </Box>
            <AvatarUpload currentAvatar={avatarBase64} onAvatarChange={setAvatarBase64} />
            <TextField
              autoFocus
              fullWidth
              label="Profile Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              error={!!error}
              helperText={error || "Enter a name for your profile (1-40 characters)"}
              disabled={isSubmitting}
              inputProps={{
                maxLength: 40,
                "aria-label": "Profile name"
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !name.trim()}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
