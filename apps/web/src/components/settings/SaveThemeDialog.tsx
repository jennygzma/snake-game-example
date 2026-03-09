import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from "@mui/material";

interface SaveThemeDialogProps {
  open: boolean;
  initialName?: string;
  onClose: () => void;
  onSave: (name: string) => void | Promise<void>;
}

export const SaveThemeDialog = ({ open, initialName = "", onClose, onSave }: SaveThemeDialogProps) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setName(initialName);
      setError(null);
      setSaving(false);
    }
  }, [open, initialName]);

  const handleSave = async () => {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setError("Theme name is required");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Theme name must be at least 2 characters");
      return;
    }

    if (trimmedName.length > 50) {
      setError("Theme name must be 50 characters or less");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await onSave(trimmedName);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save theme");
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !saving) {
      handleSave();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="save-theme-dialog-title"
      aria-describedby="save-theme-dialog-description"
    >
      <DialogTitle id="save-theme-dialog-title">
        Save Theme
      </DialogTitle>
      
      <DialogContent>
        <Box id="save-theme-dialog-description" sx={{ mb: 2 }}>
          Enter a name for your custom theme:
        </Box>
        
        <TextField
          autoFocus
          fullWidth
          label="Theme Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          error={!!error}
          helperText={error || `${name.length}/50 characters`}
          disabled={saving}
          required
          inputProps={{
            "aria-label": "Theme name",
            maxLength: 50
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          disabled={saving}
          aria-label="Cancel save theme"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving || !name.trim()}
          aria-label="Save theme"
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};