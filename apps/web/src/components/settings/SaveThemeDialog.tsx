import { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { ModalShell } from "../shared/ModalShell";

type SaveThemeDialogProps = {
  open: boolean;
  defaultName?: string;
  onSave: (name: string) => void;
  onCancel: () => void;
};

export const SaveThemeDialog = ({ open, defaultName = "", onSave, onCancel }: SaveThemeDialogProps) => {
  const [name, setName] = useState(defaultName);
  const [error, setError] = useState("");

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Theme name is required");
      return;
    }
    if (trimmed.length > 100) {
      setError("Theme name must be 100 characters or less");
      return;
    }
    onSave(trimmed);
    setName("");
    setError("");
  };

  const handleCancel = () => {
    setName(defaultName);
    setError("");
    onCancel();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSave();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      handleCancel();
    }
  };

  return (
    <ModalShell open={open} ariaLabelledBy="save-theme-dialog-title" ariaDescribedBy="save-theme-dialog-description">
      <Stack spacing={2}>
        <Typography id="save-theme-dialog-title" variant="h5" component="h2">
          Save Theme
        </Typography>
        <Typography id="save-theme-dialog-description" variant="body2" color="text.secondary">
          Give your custom theme a name
        </Typography>
        <TextField
          label="Theme Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          error={!!error}
          helperText={error || `${name.length}/100 characters`}
          fullWidth
          autoFocus
          inputProps={{
            maxLength: 100,
            "aria-label": "Theme name"
          }}
        />
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button onClick={handleCancel} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary" disabled={!name.trim()}>
            Save
          </Button>
        </Box>
      </Stack>
    </ModalShell>
  );
};