import { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { ProfileCard } from "./ProfileCard";
import { CreateProfileDialog } from "./CreateProfileDialog";
import { approvedIcons } from "../../theme/approvedIcons";
import type { Profile } from "@snake/contracts";

const AccountCircleIcon = approvedIcons.accountCircle;

interface ProfilePickerProps {
  profiles: Profile[];
  onSelectProfile: (profile: Profile) => void;
  onCreateProfile: (name: string, avatarBase64: string | null) => Promise<void>;
}

export const ProfilePicker = ({ profiles, onSelectProfile, onCreateProfile }: ProfilePickerProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 4
        }}
      >
        <Box
          sx={{
            width: "100%",
            textAlign: "center"
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 700 }}>
            Choose Profile
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: "center",
            mb: 4
          }}
        >
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} onSelect={onSelectProfile} />
          ))}

          <Box
            sx={{
              width: 160,
              height: 160,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: 2,
              borderColor: "divider",
              borderStyle: "dashed",
              borderRadius: 1,
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "action.hover"
              }
            }}
            onClick={() => setDialogOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setDialogOpen(true);
              }
            }}
            aria-label="Create new profile"
          >
            <Box sx={{ textAlign: "center" }}>
              <AccountCircleIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                New Profile
              </Typography>
            </Box>
          </Box>
        </Box>

        {profiles.length === 0 && (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center" }}>
            No profiles yet. Create one to get started!
          </Typography>
        )}
      </Container>

      <CreateProfileDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={async ({ name, avatarBase64 }) => {
          await onCreateProfile(name, avatarBase64 ?? null);
          setDialogOpen(false);
        }}
      />
    </>
  );
};
