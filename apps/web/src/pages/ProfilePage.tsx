import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  Paper,
  Divider
} from "@mui/material";
import { Delete, Save } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../components/shared/PageLayout";
import { AvatarUpload } from "../components/profile/AvatarUpload";
import { DeleteProfileDialog } from "../components/profile/DeleteProfileDialog";
import { useProfile } from "../hooks/useProfile";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { activeProfile, updateProfile, deleteProfile } = useProfile();
  
  const [name, setName] = useState(activeProfile?.name || "");
  const [avatarBase64, setAvatarBase64] = useState<string | null | undefined>(
    activeProfile?.avatarBase64
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!activeProfile) {
    return (
      <PageLayout>
        <Typography>No active profile</Typography>
      </PageLayout>
    );
  }

  const hasChanges =
    name !== activeProfile.name || avatarBase64 !== activeProfile.avatarBase64;

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (name.length > 40) {
      setError("Name must be 40 characters or less");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await updateProfile(activeProfile.id, {
        name: name.trim(),
        avatarBase64
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (profileId: string) => {
    await deleteProfile(profileId);
    // After deletion, user will be redirected to profile picker
    navigate("/");
  };

  return (
    <PageLayout>
      <Paper sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
        <Stack spacing={4}>
          <Typography variant="h5" component="h2">
            Edit Profile
          </Typography>

          <AvatarUpload
            currentAvatar={avatarBase64}
            onAvatarChange={setAvatarBase64}
            size={120}
          />

          <TextField
            label="Profile Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!error}
            helperText={error || "Max 40 characters"}
            inputProps={{ maxLength: 40 }}
            disabled={saving}
          />

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={!hasChanges || saving}
              fullWidth
            >
              Save Changes
            </Button>
          </Stack>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="error" gutterBottom>
              Danger Zone
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Deleting your profile will permanently remove all associated themes, scores, and
              settings. This action cannot be undone.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Profile
            </Button>
          </Box>
        </Stack>
      </Paper>

      <DeleteProfileDialog
        open={deleteDialogOpen}
        profile={activeProfile}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDelete}
      />
    </PageLayout>
  );
};