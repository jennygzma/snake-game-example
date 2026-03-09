import { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useProfile } from "../../hooks/useProfile";
import { ProfileCard } from "./ProfileCard";
import { CreateProfileDialog } from "./CreateProfileDialog";

export const ProfilePicker = () => {
  const { profiles, activateProfile, createProfile } = useProfile();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleSelectProfile = async (profileId: string) => {
    await activateProfile(profileId);
  };

  const handleCreateProfile = async (name: string, avatarBase64?: string) => {
    await createProfile({ name, avatarBase64 });
    setCreateDialogOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 4
        }}
      >
        <Typography variant="h3" align="center" gutterBottom>
          Snake Game
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Select Profile
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)"
            },
            gap: 3
          }}
        >
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} onClick={() => handleSelectProfile(profile.id)} />
          ))}
          
          <Box
            sx={{
              height: "100%",
              minHeight: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 1,
              p: 3,
              cursor: "pointer",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "action.hover"
              }
            }}
            onClick={() => setCreateDialogOpen(true)}
          >
            <Box sx={{ textAlign: "center" }}>
              <Add sx={{ fontSize: 48, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                Create New Profile
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <CreateProfileDialog
        open={createDialogOpen}
        onConfirm={handleCreateProfile}
        onCancel={() => setCreateDialogOpen(false)}
      />
    </Container>
  );
};