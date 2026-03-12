import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Typography, Stack, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PageLayout } from "../components/shared/PageLayout";
import { IconActionButton } from "../components/shared/IconActionButton";
import { AvatarUpload } from "../components/profile/AvatarUpload";
import { CreateProfileDialog } from "../components/profile/CreateProfileDialog";
import { DeleteProfileDialog } from "../components/profile/DeleteProfileDialog";
import { ProfileCard } from "../components/profile/ProfileCard";
import { useProfile } from "../hooks/useProfile";
import { approvedIcons } from "../theme/approvedIcons";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { profiles, activeProfile, updateProfile, deleteProfile, activateProfile, createProfile, isLoading } =
    useProfile();
  
  const [name, setName] = useState(activeProfile?.name || "");
  const [avatarBase64, setAvatarBase64] = useState<string | null>(activeProfile?.avatarBase64 || null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    setName(activeProfile?.name || "");
    setAvatarBase64(activeProfile?.avatarBase64 || null);
    setError("");
  }, [activeProfile?.avatarBase64, activeProfile?.id, activeProfile?.name]);

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

  const handleCreateProfile = async ({ name, avatarBase64 }: { name: string; avatarBase64?: string | null }) => {
    const created = await createProfile({
      name,
      ...(avatarBase64 ? { avatarBase64 } : {})
    });
    await activateProfile(created.id);
  };

  if (isLoading) {
    return (
      <PageLayout>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>
        <Typography>Loading...</Typography>
      </PageLayout>
    );
  }

  if (!activeProfile) {
    return (
      <PageLayout>
        <Typography variant="h4" component="h1" gutterBottom>
          Profiles
        </Typography>
        {profiles.length === 0 ? (
          <Typography>No profiles found.</Typography>
        ) : (
          <Stack spacing={2}>
            <Typography variant="body2" sx={{ color: theme.ui.leaderboard.mutedText }}>
              Choose a profile to activate:
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {profiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onSelect={async (selected) => {
                    await activateProfile(selected.id);
                  }}
                />
              ))}
            </Box>
          </Stack>
        )}
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: "center" }}>
          Edit Profile
        </Typography>
        <Stack spacing={1.5} sx={{ maxWidth: 760, mx: "auto", mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" component="h2">
              Profiles
            </Typography>
            <IconActionButton
              tone="neutral"
              variant="outlined"
              icon={<approvedIcons.add />}
              iconColor={theme.icons.add || theme.icons.default}
              label="Add Profile"
              iconOnly
              onClick={() => setCreateDialogOpen(true)}
              disabled={isSaving}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {profiles.map((profile) => (
              <Box key={profile.id} sx={{ display: "grid", gap: 1, justifyItems: "center" }}>
                <ProfileCard profile={profile} onSelect={async (selected) => void activateProfile(selected.id)} />
                {profile.isActive ? (
                  <Chip
                    size="small"
                    label="Active"
                    sx={{
                      bgcolor: (theme) => theme.ui.profile.activeChipBg,
                      color: (theme) => theme.ui.profile.activeChipText,
                      fontWeight: 600
                    }}
                  />
                ) : (
                  <IconActionButton
                    size="small"
                    variant="text"
                    tone="neutral"
                    icon={<approvedIcons.swapHoriz />}
                    iconColor={theme.icons.swapHoriz || theme.icons.default}
                    label="Switch Profile"
                    iconOnly
                    onClick={async () => {
                      await activateProfile(profile.id);
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Stack>
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
            <Box
              role="alert"
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 1,
                border: "1px solid",
                borderColor: (theme) => theme.ui.feedback.errorBorder,
                bgcolor: (theme) => theme.ui.feedback.errorBg,
                color: (theme) => theme.ui.feedback.errorText
              }}
            >
              {error}
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between", mt: 2 }}>
            <IconActionButton
              variant="outlined"
              tone="danger"
              icon={<approvedIcons.delete />}
              iconColor={theme.icons.delete || theme.icons.default}
              label="Delete Profile"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isSaving}
              sx={{
                color: (theme) => theme.ui.profile.deleteButtonBg,
                borderColor: (theme) => theme.ui.profile.deleteButtonBg,
                "&:hover": {
                  borderColor: (theme) => theme.ui.profile.deleteButtonHoverBg,
                  color: (theme) => theme.ui.profile.deleteButtonHoverBg
                }
              }}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <IconActionButton
                tone="neutral"
                variant="outlined"
                icon={<approvedIcons.close />}
                iconColor={theme.icons.close || theme.icons.default}
                label="Cancel"
                onClick={() => navigate("/")}
                disabled={isSaving}
              />
              <IconActionButton
                tone="primary"
                variant="contained"
                icon={<approvedIcons.check />}
                iconColor={theme.icons.check || theme.icons.default}
                label={isSaving ? "Saving..." : "Save Changes"}
                onClick={handleSave}
                disabled={isSaving || !name.trim()}
              />
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
      <CreateProfileDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreateProfile}
      />
    </>
  );
};
