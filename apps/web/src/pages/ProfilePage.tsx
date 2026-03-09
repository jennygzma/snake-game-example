import { Box, TextField, Button, Avatar, Typography, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../components/shared/PageLayout";
import { Panel } from "../components/shared/Panel";
import { AvatarUpload } from "../components/profile/AvatarUpload";
import { DeleteProfileDialog } from "../components/profile/DeleteProfileDialog";
import { useProfile } from "../hooks/useProfile";
import { approvedIcons } from "../theme/approvedIcons";

const EditIcon = approvedIcons.edit;

export const ProfilePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { activeProfile, updateProfile } = useProfile();
  const [name, setName] = useState(activeProfile?.name || "");
  const [avatarBase64, setAvatarBase64] = useState<string | null>(activeProfile?.avatarBase64 || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleSave = async () => {
    if (!activeProfile) return;

    setError(null);
    setSuccess(false);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (name.length > 40) {
      setError("Name must be 40 characters or less");
      return;
    }

    setLoading(true);
    try {
      const updated = await updateProfile(activeProfile.id, {
        name: name.trim(),
        avatarBase64: avatarBase64
      });

      if (updated) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Failed to update profile");
      }
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComplete = () => {
    setDeleteDialogOpen(false);
    // Navigate back to home - ProfilePicker will show if no active profile
    navigate("/");
  };

  if (!activeProfile) {
    return (
      <PageLayout>
        <Panel>
          <Typography>No active profile</Typography>
        </Panel>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Panel>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <EditIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
          <Typography variant="h4">Edit Profile</Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Profile updated successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Profile Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!error && !name.trim()}
            helperText="Enter a name for this profile (1-40 characters)"
            inputProps={{ maxLength: 40 }}
            fullWidth
          />

          <AvatarUpload value={avatarBase64} onChange={setAvatarBase64} />

          <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Profile
            </Button>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Panel>

      <DeleteProfileDialog
        open={deleteDialogOpen}
        profile={activeProfile}
        onClose={handleDeleteComplete}
      />
    </PageLayout>
  );
};