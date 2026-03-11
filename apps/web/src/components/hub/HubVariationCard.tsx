import { Box, Card, CardContent, CardActions, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { HubVariationWithCreator } from "@snake/contracts";
import { IconActionButton } from "../shared/IconActionButton";
import { ProfileAvatar } from "../shared/ProfileAvatar";
import { approvedIcons } from "../../theme/approvedIcons";

interface HubVariationCardProps {
  variation: HubVariationWithCreator;
  onFavorite: (id: string) => void | Promise<void>;
  onCopy: (id: string) => void | Promise<void>;
}

export const HubVariationCard = ({ variation, onFavorite, onCopy }: HubVariationCardProps) => {
  const muiTheme = useTheme();

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)"
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {variation.name}
        </Typography>

        {variation.description && (
          <Typography variant="body2" sx={{ color: muiTheme.ui.leaderboard.mutedText, mb: 2 }}>
            {variation.description}
          </Typography>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <ProfileAvatar
            src={variation.creator.profileAvatar}
            size={24}
            iconSize={16}
            bgColor={muiTheme.ui.nav.profileAvatarBg}
          />
          <Typography variant="caption" sx={{ color: muiTheme.ui.leaderboard.mutedText }}>
            by {variation.creator.profileName}
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: muiTheme.ui.leaderboard.mutedText, mt: 1 }}>
          Difficulty: {variation.difficulty ?? "medium"} | Speed: {variation.baseSpeed}
        </Typography>
        <Typography variant="body2" sx={{ color: muiTheme.ui.leaderboard.mutedText }}>
          Grid: {variation.gridSize} | Foods: {variation.maxConcurrentFoods}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ color: muiTheme.ui.leaderboard.mutedText }} gutterBottom display="block">
            Powerups: {variation.powerupTypes.length}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 1 }}>
            {variation.powerupTypes.slice(0, 5).map((powerup, index) => (
              <Box
                key={`${variation.id}-powerup-${index}`}
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: 0.5,
                  border: "1px solid",
                  borderColor: muiTheme.ui.shared.panelBorder,
                  bgcolor: powerup.color
                }}
                title={`${powerup.effect} (${powerup.value})`}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Typography variant="caption" sx={{ color: muiTheme.ui.leaderboard.mutedText }}>
            ❤️ {variation.favoriteCount}
          </Typography>
          <Typography variant="caption" sx={{ color: muiTheme.ui.leaderboard.mutedText }}>
            📥 {variation.usageCount}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2, pt: 0 }}>
        <IconActionButton
          size="small"
          variant={variation.isFavorited ? "contained" : "outlined"}
          tone={variation.isFavorited ? "primary" : "neutral"}
          icon={variation.isFavorited ? <approvedIcons.check /> : <approvedIcons.add />}
          iconColor={muiTheme.icons.default}
          label={variation.isFavorited ? "Unfavorite variation" : "Favorite variation"}
          iconOnly
          onClick={() => onFavorite(variation.id)}
        />
        <IconActionButton
          size="small"
          variant="contained"
          tone="primary"
          icon={<approvedIcons.add />}
          iconColor={muiTheme.icons.add || muiTheme.icons.default}
          label="Copy variation to your collection"
          iconOnly
          onClick={() => onCopy(variation.id)}
        />
      </CardActions>
    </Card>
  );
};