import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField
} from "@mui/material";
import { useState } from "react";

type SaveThemeDialogProps = {
  open: boolean;
  defaultName?: string;
  onClose: () => void;
  onSave: (name: string) => void;
};

export const SaveThemeDialog = ({ open, defaultName = "", onClose, onSave }: SaveThemeDialogProps) => {
  const [themeName, setThemeName] = useState(defaultName);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!themeName.trim()) {
      setError("Theme name is required");
      return;
    }

    if (themeName.length > 100) {
      setError("Theme name must be 100 characters or less");
      return;
    }

    onSave(themeName.trim());
    setThemeName("");
    setError("");
  };

  const handleClose = () => {
    setThemeName(defaultName);
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Save Theme</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            autoFocus
            label="Theme Name"
            placeholder="My Custom Theme"
            value={themeName}
            onChange={(e) => {
              setThemeName(e.target.value);
              setError("");
            }}
            error={!!error}
            helperText={error || "Give your theme a memorable name"}
            fullWidth
            inputProps={{ maxLength: 100 }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};