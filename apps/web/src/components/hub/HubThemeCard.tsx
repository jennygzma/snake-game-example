import { Box, Card, CardContent, CardActions, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { HubThemeWithCreator } from "@snake/contracts";
import { IconActionButton } from "../shared/IconActionButton";
import { ProfileAvatar } from "../shared/ProfileAvatar";
import { approvedIcons } from "../../theme/approvedIcons";

interface HubThemeCardProps {
  theme: HubThemeWithCreator;
  onFavorite: (id: string) => void | Promise<void>;
  onCopy: (id: string) => void | Promise<void>;
}

export const HubThemeCard = ({ theme, onFavorite, onCopy }: HubThemeCardProps) => {
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
          {theme.name}
        </Typography>

        {theme.description && (
          <Typography variant="body2" sx={{ color: muiTheme.ui.leaderboard.mutedText, mb: 2 }}>
            {theme.description}
          </Typography>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <ProfileAvatar
            src={theme.creator.profileAvatar}
            size={24}
            iconSize={16}
            bgColor={muiTheme.ui.nav.profileAvatarBg}
          />
          <Typography variant="caption" sx={{ color: muiTheme.ui.leaderboard.mutedText }}>
            by {theme.creator.profileName}
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ color: muiTheme.ui.leaderboard.mutedText }} gutterBottom display="block">
          Font: {theme.fontFamily}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ color: muiTheme.ui.leaderboard.mutedText }} gutterBottom display="block">
            Color Preview:
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 0.5,
              mt: 1
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: 24,
                backgroundColor: theme.colors.snake,
                borderRadius: 0.5,
                border: `1px solid ${muiTheme.ui.themeGallery.swatchBorder}`
              }}
              title="Snake"
            />
            <Box
              sx={{
                width: "100%",
                height: 24,
                backgroundColor: theme.colors.food,
                borderRadius: 0.5,
                border: `1px solid ${muiTheme.ui.themeGallery.swatchBorder}`
              }}
              title="Food"
            />
            <Box
              sx={{
                width: "100%",
                height: 24,
                backgroundColor: theme.colors.action,
                borderRadius: 0.5,
                border: `1px solid ${muiTheme.ui.themeGallery.swatchBorder}`
              }}
              title="Action"
            />
            <Box
              sx={{
                width: "100%",
                height: 24,
                backgroundColor: theme.colors.pause,
                borderRadius: 0.5,
                border: `1px solid ${muiTheme.ui.themeGallery.swatchBorder}`
              }}
              title="Pause"
            />
            <Box
              sx={{
                width: "100%",
                height: 24,
                backgroundColor: theme.colors.danger,
                borderRadius: 0.5,
                border: `1px solid ${muiTheme.ui.themeGallery.swatchBorder}`
              }}
              title="Danger"
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Typography variant="caption" sx={{ color: muiTheme.ui.leaderboard.mutedText }}>
            ❤️ {theme.favoriteCount}
          </Typography>
          <Typography variant="caption" sx={{ color: muiTheme.ui.leaderboard.mutedText }}>
            📥 {theme.usageCount}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2, pt: 0 }}>
        <IconActionButton
          size="small"
          variant={theme.isFavorited ? "contained" : "outlined"}
          tone={theme.isFavorited ? "primary" : "neutral"}
          icon={theme.isFavorited ? <approvedIcons.check /> : <approvedIcons.add />}
          iconColor={muiTheme.icons.default}
          label={theme.isFavorited ? "Unfavorite theme" : "Favorite theme"}
          iconOnly
          onClick={() => onFavorite(theme.id)}
        />
        <IconActionButton
          size="small"
          variant="contained"
          tone="primary"
          icon={<approvedIcons.add />}
          iconColor={muiTheme.icons.add || muiTheme.icons.default}
          label="Copy theme to your collection"
          iconOnly
          onClick={() => onCopy(theme.id)}
        />
      </CardActions>
    </Card>
  );
};