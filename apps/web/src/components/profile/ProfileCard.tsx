import { Card, CardActionArea, CardContent, Typography, Box } from "@mui/material";
import type { Profile } from "@snake/contracts";
import { approvedIcons } from "../../theme/approvedIcons";

type ProfileCardProps = {
  profile: Profile;
  onClick: () => void;
};

export const ProfileCard = ({ profile, onClick }: ProfileCardProps) => {
  return (
    <Card>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                overflow: "hidden",
                bgcolor: "action.hover",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {profile.avatarBase64 ? (
                <img
                  src={profile.avatarBase64}
                  alt={`${profile.name}'s avatar`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <approvedIcons.accountCircle sx={{ fontSize: 60, color: "action.active" }} />
              )}
            </Box>
            <Typography variant="h6" align="center">
              {profile.name}
            </Typography>
            {profile.isActive && (
              <Typography variant="caption" color="primary">
                Active
              </Typography>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};