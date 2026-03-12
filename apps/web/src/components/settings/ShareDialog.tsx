import { useState } from "react";
import { TextField, Box, Button } from "@mui/material";
import { AppDialogShell } from "../shared/AppDialogShell";

interface ShareDialogProps {
  open: boolean;
  itemName: string;
  itemType: "theme" | "variation";
  onClose: () => void;
  onShare: (description?: string) => void | Promise<void>;
}

export const ShareDialog = ({ open, itemName, itemType, onClose, onShare }: ShareDialogProps) => {
  const [description, setDescription] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await onShare(description || undefined);
      setDescription("");
      onClose();
    } finally {
      setIsSharing(false);
    }
  };

  const handleClose = () => {
    if (!isSharing) {
      setDescription("");
      onClose();
    }
  };

  return (
    <AppDialogShell
      open={open}
      title={`Share ${itemType === "theme" ? "Theme" : "Variation"} to Hub`}
      titleId="share-dialog-title"
      description={`Share "${itemName}" with the community. Add an optional description to help others understand what makes it special.`}
      descriptionId="share-dialog-description"
      onClose={handleClose}
      actions={
        <>
          <Button onClick={handleClose} disabled={isSharing}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleShare} disabled={isSharing}>
            Share
          </Button>
        </>
      }
    >
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Description (optional)"
        placeholder="Describe what makes this special..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isSharing}
      />
    </AppDialogShell>
  );
};
