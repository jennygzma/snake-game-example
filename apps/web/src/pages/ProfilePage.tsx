import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, TextField, Typography, Alert } from "@mui/material";
import { useProfile } from "../hooks/useProfile";
import { PageLayout } from "../components/shared/PageLayout";
import { Panel } from "../components/shared/Panel";
import { AvatarUpload } from "../components/profile/AvatarUpload";
import { DeleteProfileDialog } from "../components/profile/DeleteProfileDialog";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { activeProfile, updateProfile, deleteProfile } = useProfile();
  
  const [name, setName] = useState(activeProfile?.name || "");
  const [avatarBase64, setAvatarBase64] = useState<string | null | undefined>(activeProfile?.avatarBase64);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  if (!activeProfile) {
    return (
      <PageLayout maxWidth="sm">
        <Alert severity="error">No active profile found</Alert>
      </PageLayout>
    );
  }

  const handleSave = async () => {
    try {
      await updateProfile(activeProfile.id, {
        name: name.trim(),
        avatarBase64
      });
      setSaveMessage("Profile updated successfully");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage("Failed to update profile");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProfile(activeProfile.id);
      setDeleteDialogOpen(false);
      navigate("/");
    } catch (error) {
      setSaveMessage("Failed to delete profile");
    }
  };

  const hasChanges = 
    name.trim() !== activeProfile.name || 
    avatarBase64 !== activeProfile.avatarBase64;

  return (
    <PageLayout maxWidth="sm" spacing={3}>
      <Typography variant="h4">Profile Settings</Typography>

      <Panel>
        <Stack spacing={3}>
          <TextField
            label="Profile Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            inputProps={{ maxLength: 40 }}
            helperText={`${name.length}/40 characters`}
          />

          <AvatarUpload value={avatarBase64} onChange={setAvatarBase64} />

          {saveMessage && (
            <Alert severity={saveMessage.includes("success") ? "success" : "error"}>
              {saveMessage}
            </Alert>
          )}

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!hasChanges || !name.trim()}
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
          </Box>

          <Box sx={{ pt: 2, borderTop: 1, borderColor: "divider" }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Danger Zone
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Profile
            </Button>
          </Box>
        </Stack>
      </Panel>

      <DeleteProfileDialog
        open={deleteDialogOpen}
        profileName={activeProfile.name}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </PageLayout>
  );
};