import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AppDialogShell } from "../shared/AppDialogShell";
import { IconActionButton } from "../shared/IconActionButton";
import { approvedIcons } from "../../theme/approvedIcons";

interface ShareDialogProps {
  open: boolean;
  itemType: "theme" | "variation";
  itemName: string;
  onClose: () => void;
  onShare: (description?: string) => void | Promise<void>;
}

export const ShareDialog = ({ open, itemType, itemName, onClose, onShare }: ShareDialogProps) => {
  const theme = useTheme();
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (open) {
      setDescription("");
      setError(null);
      setSharing(false);
    }
  }, [open]);

  const handleShare = async () => {
    const trimmedDescription = description.trim();
    
    if (trimmedDescription && trimmedDescription.length > 500) {
      setError("Description must be 500 characters or less");
      return;
    }

    try {
      setSharing(true);
      setError(null);
      await onShare(trimmedDescription || undefined);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to share ${itemType}`);
    } finally {
      setSharing(false);
    }
  };

  return (
    <AppDialogShell
      open={open}
      onClose={sharing ? undefined : onClose}
      title={`Share ${itemType === "theme" ? "Theme" : "Variation"}`}
      titleId="share-dialog-title"
      descriptionId="share-dialog-description"
      description={`Share "${itemName}" to the hub so others can discover and use it.`}
      actions={
        <>
          <IconActionButton
            tone="neutral"
            variant="text"
            icon={<approvedIcons.close />}
            iconColor={theme.icons.close || theme.icons.default}
            label="Cancel"
            onClick={onClose}
            disabled={sharing}
            aria-label="Cancel share"
          />
          <IconActionButton
            tone="primary"
            onClick={handleShare}
            variant="contained"
            icon={<approvedIcons.check />}
            iconColor={theme.icons.check || theme.icons.default}
            label={sharing ? "Sharing..." : "Share"}
            disabled={sharing}
            aria-label={`Share ${itemType} to hub`}
          />
        </>
      }
    >
      <TextField
        autoFocus
        fullWidth
        label="Description (Optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={!!error}
        helperText={error || `${description.length}/500 characters`}
        disabled={sharing}
        multiline
        rows={3}
        inputProps={{
          "aria-label": "Share description",
          maxLength: 500
        }}
      />
    </AppDialogShell>
  );
};