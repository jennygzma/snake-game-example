import { Box, Card, CardActionArea, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Profile } from "@snake/contracts";
import { ProfileAvatar } from "../shared/ProfileAvatar";

interface ProfileCardProps {
  profile: Profile;
  onSelect: (profile: Profile) => void;
}

export const ProfileCard = ({ profile, onSelect }: ProfileCardProps) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        width: 160,
        height: 160
      }}
    >
      <CardActionArea
        onClick={() => onSelect(profile)}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          p: 2
        }}
      >
        <ProfileAvatar
          src={profile.avatarBase64 || undefined}
          size={80}
          iconSize={60}
          bgColor={theme.ui.profileCard.avatarBg}
        />
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical"
          }}
        >
          {profile.name}
        </Typography>
      </CardActionArea>
    </Card>
  );
};
