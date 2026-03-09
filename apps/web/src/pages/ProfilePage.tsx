import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { PageLayout } from "../components/shared/PageLayout";
import { AvatarUpload } from "../components/profile/AvatarUpload";
import { DeleteProfileDialog } from "../components/profile/DeleteProfileDialog";
import { useProfile } from "../hooks/useProfile";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { activeProfile, updateProfile, deleteProfile, isLoading } = useProfile();
  
  const [name, setName] = useState(activeProfile?.name || "");
  const [avatarBase64, setAvatarBase64] = useState<string | null>(activeProfile?.avatarBase64 || null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleSave = async () => {
    if (!activeProfile) return;

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (name.trim().length < 1 || name.trim().length > 40) {
      setError("Name must be between 1 and 40 characters");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await updateProfile(activeProfile.id, {
        name: name.trim(),
        avatarBase64
      });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (profileId: string) => {
    await deleteProfile(profileId);
    navigate("/");
  };

  if (isLoading || !activeProfile) {
    return (
      <PageLayout>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>
        <Typography>Loading...</Typography>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: "center" }}>
          Edit Profile
        </Typography>
        <Box
          sx={{
            maxWidth: 500,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 3
          }}
        >
          <AvatarUpload
            currentAvatar={avatarBase64}
            onAvatarChange={setAvatarBase64}
          />

          <TextField
            fullWidth
            label="Profile Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            error={!!error}
            helperText={error || "Enter a name for your profile (1-40 characters)"}
            disabled={isSaving}
            inputProps={{
              maxLength: 40
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isSaving}
            >
              Delete Profile
            </Button>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/")}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isSaving || !name.trim()}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Box>
        </Box>
      </PageLayout>

      <DeleteProfileDialog
        open={deleteDialogOpen}
        profile={activeProfile}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDelete}
      />
    </>
  );
};