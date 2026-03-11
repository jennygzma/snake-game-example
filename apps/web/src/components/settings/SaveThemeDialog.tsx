import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AppDialogShell } from "../shared/AppDialogShell";
import { IconActionButton } from "../shared/IconActionButton";
import { approvedIcons } from "../../theme/approvedIcons";

interface SaveThemeDialogProps {
  open: boolean;
  initialName?: string;
  onClose: () => void;
  onSave: (name: string) => void | Promise<void>;
}

export const SaveThemeDialog = ({ open, initialName = "", onClose, onSave }: SaveThemeDialogProps) => {
  const theme = useTheme();
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
    <AppDialogShell
      open={open}
      onClose={saving ? undefined : onClose}
      title="Save Theme"
      titleId="save-theme-dialog-title"
      descriptionId="save-theme-dialog-description"
      description="Enter a name for your custom theme:"
      actions={
        <>
          <IconActionButton
            tone="neutral"
            variant="text"
            icon={<approvedIcons.close />}
            iconColor={theme.icons.close || theme.icons.default}
            label="Cancel"
            onClick={onClose}
            disabled={saving}
            aria-label="Cancel save theme"
          />
          <IconActionButton
            tone="primary"
            onClick={handleSave}
            variant="contained"
            icon={<approvedIcons.check />}
            iconColor={theme.icons.check || theme.icons.default}
            label={saving ? "Saving..." : "Save"}
            disabled={saving || !name.trim()}
            aria-label="Save theme"
          />
        </>
      }
    >
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
    </AppDialogShell>
  );
};
