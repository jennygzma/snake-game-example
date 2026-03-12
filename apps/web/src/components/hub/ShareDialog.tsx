import { useState } from "react";
import { TextField, Box } from "@mui/material";
import { AppDialogShell } from "../shared/AppDialogShell";
import { AppButton } from "../shared/AppButton";

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (description?: string) => void;
  itemName: string;
  itemType: "theme" | "variation";
  isSharing?: boolean;
}

export const ShareDialog = ({
  open,
  onClose,
  onConfirm,
  itemName,
  itemType,
  isSharing = false
}: ShareDialogProps) => {
  const [description, setDescription] = useState("");

  const handleConfirm = () => {
    onConfirm(description || undefined);
    setDescription("");
  };

  const handleClose = () => {
    onClose();
    setDescription("");
  };

  return (
    <AppDialogShell
      open={open}
      onClose={handleClose}
      title={`Share ${itemType === "theme" ? "Theme" : "Variation"} to Hub`}
      titleId="share-dialog-title"
      description={`Share "${itemName}" to the community hub. Other users will be able to view and copy this ${itemType} to their own collection.`}
      descriptionId="share-dialog-description"
      actions={
        <Box sx={{ display: "flex", gap: 1 }}>
          <AppButton onClick={handleClose} tone="neutral" disabled={isSharing}>
            Cancel
          </AppButton>
          <AppButton onClick={handleConfirm} tone="primary" disabled={isSharing}>
            {isSharing ? "Sharing..." : "Share to Hub"}
          </AppButton>
        </Box>
      }
    >
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Description (Optional)"
        placeholder={`Describe your ${itemType}...`}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isSharing}
        inputProps={{
          maxLength: 500
        }}
        helperText={`${description.length}/500 characters`}
        sx={{
          mt: 1,
          "& .MuiOutlinedInput-root": {
            bgcolor: (theme) => theme.palette.background.paper
          }
        }}
      />
    </AppDialogShell>
  );
};