import { useState } from "react";
import { TextField, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { CreateProfileInput } from "@snake/contracts";
import { AppDialogShell } from "../shared/AppDialogShell";
import { IconActionButton } from "../shared/IconActionButton";
import { approvedIcons } from "../../theme/approvedIcons";
import { AvatarUpload } from "./AvatarUpload";

interface CreateProfileDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: CreateProfileInput) => Promise<void>;
}

export const CreateProfileDialog = ({ open, onClose, onCreate }: CreateProfileDialogProps) => {
  const theme = useTheme();
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
    <AppDialogShell
      open={open}
      onClose={handleClose}
      title="Create Profile"
      titleId="create-profile-dialog-title"
      descriptionId="create-profile-dialog-description"
      description="Create a new profile name and optional avatar."
      actions={
        <>
          <IconActionButton
            tone="neutral"
            variant="text"
            icon={<approvedIcons.close />}
            iconColor={theme.icons.close || theme.icons.default}
            label="Cancel"
            onClick={handleClose}
            disabled={isSubmitting}
          />
          <IconActionButton
            type="submit"
            tone="primary"
            variant="contained"
            icon={<approvedIcons.add />}
            iconColor={theme.icons.add || theme.icons.default}
            label={isSubmitting ? "Creating..." : "Create"}
            disabled={isSubmitting || !name.trim()}
          />
        </>
      }
      paperProps={{
        component: "form",
        onSubmit: (e: React.FormEvent<HTMLFormElement>) => void handleSubmit(e)
      }}
    >
      <Box sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 3 }}>
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
    </AppDialogShell>
  );
};
