import { useState } from "react";
import { Box, Typography, Button, Grid, Stack, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { ProfileCard } from "./ProfileCard";
import { CreateProfileDialog } from "./CreateProfileDialog";
import { useProfile } from "../../hooks/useProfile";

export const ProfilePicker = () => {
  const { profiles, loading, createProfile, activateProfile } = useProfile();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleSelectProfile = async (profileId: string) => {
    try {
      await activateProfile(profileId);
      // The ProfileContext will update activeProfile, which will trigger app re-render
    } catch (error) {
      console.error("Failed to activate profile:", error);
    }
  };

  const handleCreateProfile = async (name: string, avatarBase64: string | null) => {
    await createProfile({ name, avatarBase64 });
    // If this is the first profile, it will auto-activate
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Typography>Loading profiles...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 4
        }}
      >
        <Stack spacing={4} alignItems="center" sx={{ width: "100%" }}>
          <Typography variant="h4" component="h1">
            Select Profile
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {profiles.map((profile) => (
              <Grid key={profile.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ProfileCard profile={profile} onClick={() => handleSelectProfile(profile.id)} />
              </Grid>
            ))}

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Box
                sx={{
                  minWidth: 120,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Add />}
                  onClick={() => setCreateDialogOpen(true)}
                  sx={{
                    height: 200,
                    minWidth: 160,
                    flexDirection: "column",
                    gap: 1
                  }}
                >
                  Create New Profile
                </Button>
              </Box>
            </Grid>
          </Grid>

          {profiles.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Create a profile to get started
            </Typography>
          )}
        </Stack>

        <CreateProfileDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onCreate={handleCreateProfile}
        />
      </Box>
    </Container>
  );
};