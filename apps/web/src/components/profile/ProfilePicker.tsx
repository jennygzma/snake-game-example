import { Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { approvedIcons } from "../../theme/approvedIcons";
import { ProfileCard } from "./ProfileCard";
import { CreateProfileDialog } from "./CreateProfileDialog";

const AddIcon = approvedIcons.add;

export const ProfilePicker = () => {
  const theme = useTheme();
  const { profiles, loading, activateProfile } = useProfile();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activatingProfileId, setActivatingProfileId] = useState<string | null>(null);

  const handleSelectProfile = async (profileId: string) => {
    if (activatingProfileId) return;
    setActivatingProfileId(profileId);
    try {
      await activateProfile(profileId);
      // After activation, the app should redirect to main view
      // This will be handled by the parent component
    } finally {
      setActivatingProfileId(null);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh"
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 4,
        backgroundColor: theme.palette.background.default
      }}
    >
      <Typography variant="h3" gutterBottom>
        Select Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Choose who's playing
      </Typography>
      {activatingProfileId ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Activating profile...
        </Typography>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)"
          },
          gap: 3,
          maxWidth: 800
        }}
      >
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onClick={() => {
              if (!activatingProfileId) {
                void handleSelectProfile(profile.id);
              }
            }}
          />
        ))}

        <Box
          onClick={() => {
            if (!activatingProfileId) {
              setCreateDialogOpen(true);
            }
          }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            padding: 3,
            minHeight: 180,
            borderRadius: theme.shape.borderRadius + "px",
            border: `2px dashed ${theme.palette.divider}`,
            cursor: activatingProfileId ? "not-allowed" : "pointer",
            opacity: activatingProfileId ? 0.7 : 1,
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: theme.palette.primary.main,
              backgroundColor: theme.palette.action.hover
            },
            "&:focus-visible": {
              outline: `3px solid ${theme.palette.primary.main}`,
              outlineOffset: "2px"
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Create new profile"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setCreateDialogOpen(true);
            }
          }}
        >
          <AddIcon sx={{ fontSize: 48, color: theme.palette.text.secondary }} />
          <Typography variant="h6" color="text.secondary">
            Create New Profile
          </Typography>
        </Box>
      </Box>

      <CreateProfileDialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} />
    </Box>
  );
};
