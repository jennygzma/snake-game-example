import { Avatar, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Profile } from "@snake/contracts";
import { approvedIcons } from "../../theme/approvedIcons";

interface ProfileCardProps {
  profile: Profile;
  onClick: () => void;
}

const AccountCircleIcon = approvedIcons.accountCircle;

export const ProfileCard = ({ profile, onClick }: ProfileCardProps) => {
  const theme = useTheme();

  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
        padding: 3,
        borderRadius: theme.shape.borderRadius + "px",
        backgroundColor: theme.palette.background.paper,
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[4]
        },
        "&:focus-visible": {
          outline: `3px solid ${theme.palette.primary.main}`,
          outlineOffset: "2px"
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Select profile ${profile.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Avatar
        src={profile.avatarBase64 || undefined}
        sx={{
          width: 80,
          height: 80,
          backgroundColor: theme.palette.primary.main
        }}
      >
        {!profile.avatarBase64 && <AccountCircleIcon sx={{ fontSize: 80 }} />}
      </Avatar>
      <Typography variant="h6" textAlign="center">
        {profile.name}
      </Typography>
      {profile.isActive && (
        <Typography variant="caption" color="primary">
          Active
        </Typography>
      )}
    </Box>
  );
};