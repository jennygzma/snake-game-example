import { Box, Card, CardActionArea, Typography, Avatar } from "@mui/material";
import { approvedIcons } from "../../theme/approvedIcons";
import type { Profile } from "@snake/contracts";

const AccountCircleIcon = approvedIcons.accountCircle;

interface ProfileCardProps {
  profile: Profile;
  onSelect: (profile: Profile) => void;
}

export const ProfileCard = ({ profile, onSelect }: ProfileCardProps) => {
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
        <Avatar
          src={profile.avatarBase64 || undefined}
          sx={{
            width: 80,
            height: 80,
            bgcolor: "primary.main"
          }}
        >
          {!profile.avatarBase64 && <AccountCircleIcon sx={{ width: 60, height: 60 }} />}
        </Avatar>
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