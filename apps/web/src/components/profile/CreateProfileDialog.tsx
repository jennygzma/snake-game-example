import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { AvatarUpload } from "./AvatarUpload";

type CreateProfileDialogProps = {
  open: boolean;
  onConfirm: (name: string, avatarBase64?: string) => void;
  onCancel: () => void;
};

export const CreateProfileDialog = ({ open, onConfirm, onCancel }: CreateProfileDialogProps) => {
  const [name, setName] = useState("");
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

  const handleConfirm = () => {
    if (name.trim()) {
      onConfirm(name.trim(), avatarBase64 || undefined);
      setName("");
      setAvatarBase64(null);
    }
  };

  const handleCancel = () => {
    setName("");
    setAvatarBase64(null);
    onCancel();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Create Profile</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Profile Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          inputProps={{ maxLength: 40 }}
          helperText={`${name.length}/40 characters`}
        />
        <AvatarUpload value={avatarBase64} onChange={setAvatarBase64} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!name.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};