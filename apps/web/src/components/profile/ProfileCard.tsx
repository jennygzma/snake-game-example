import { Card, CardActionArea, Avatar, Typography, Stack } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import type { Profile } from "@snake/contracts";

interface ProfileCardProps {
  profile: Profile;
  onClick: () => void;
}

export const ProfileCard = ({ profile, onClick }: ProfileCardProps) => {
  return (
    <Card
      sx={{
        minWidth: 120,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4
        }
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5
        }}
      >
        <Stack spacing={2} alignItems="center">
          {profile.avatarBase64 ? (
            <Avatar
              src={profile.avatarBase64}
              sx={{
                width: 80,
                height: 80,
                border: (theme) => `2px solid ${theme.palette.divider}`
              }}
            />
          ) : (
            <AccountCircle
              sx={{
                width: 80,
                height: 80,
                color: "text.secondary"
              }}
            />
          )}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 500,
              textAlign: "center",
              wordBreak: "break-word"
            }}
          >
            {profile.name}
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
};