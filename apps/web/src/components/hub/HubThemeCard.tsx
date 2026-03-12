import { createElement } from "react";
import { Box, Typography, Chip } from "@mui/material";
import type { SharedThemeWithCreator } from "@snake/contracts";
import { Panel } from "../shared/Panel";
import { ProfileAvatar } from "../shared/ProfileAvatar";
import { IconActionButton } from "../shared/IconActionButton";
import { approvedIcons } from "../../theme/approvedIcons";

interface HubThemeCardProps {
  theme: SharedThemeWithCreator;
  isFavorited?: boolean;
  onFavorite: (themeId: string) => void;
  onUnfavorite: (themeId: string) => void;
  onCopy: (themeId: string) => void;
}

export const HubThemeCard = ({
  theme,
  isFavorited = false,
  onFavorite,
  onUnfavorite,
  onCopy
}: HubThemeCardProps) => {
  const handleFavoriteToggle = () => {
    if (isFavorited) {
      onUnfavorite(theme.id);
    } else {
      onFavorite(theme.id);
    }
  };

  const handleCopy = () => {
    onCopy(theme.id);
  };

  return (
    <Panel
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100%"
      }}
    >
      {/* Theme Preview */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          p: 2,
          borderRadius: (theme) => `${theme.shape.borderRadius}px`,
          bgcolor: theme.colors.boardBg,
          border: "1px solid",
          borderColor: (muiTheme) => muiTheme.ui.shared.panelBorder
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: theme.colors.snake,
            border: "2px solid",
            borderColor: theme.colors.snakeHead
          }}
        />
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: theme.colors.food
          }}
        />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            gap: 0.5,
            flexWrap: "wrap",
            alignItems: "center"
          }}
        >
          {Object.values(theme.iconColors).map((color, idx) => (
            <Box
              key={idx}
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                bgcolor: color
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Theme Info */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          {theme.name}
        </Typography>
        {theme.description && (
          <Typography
            variant="body2"
            sx={{
              color: (theme) => theme.palette.text.secondary,
              mb: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {theme.description}
          </Typography>
        )}
        <Typography variant="caption" sx={{ color: (theme) => theme.palette.text.secondary }}>
          Font: {theme.fontFamily}
        </Typography>
      </Box>

      {/* Creator Info */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <ProfileAvatar src={theme.creator.avatarBase64} size={32} />
        <Typography variant="body2" sx={{ color: (theme) => theme.palette.text.secondary }}>
          by {theme.creator.name}
        </Typography>
      </Box>

      {/* Stats & Actions */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pt: 1,
          borderTop: "1px solid",
          borderColor: (theme) => theme.ui.shared.panelBorder
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Chip
            icon={createElement(approvedIcons.favorite, { fontSize: "small" })}
            label={theme.favoriteCount}
            size="small"
            variant="outlined"
          />
          <Chip label={`${theme.usageCount} copies`} size="small" variant="outlined" />
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconActionButton
            icon={createElement(isFavorited ? approvedIcons.favorite : approvedIcons.favoriteBorder)}
            label={isFavorited ? "Unfavorite" : "Favorite"}
            onClick={handleFavoriteToggle}
          />
          <IconActionButton
            icon={createElement(approvedIcons.contentCopy)}
            label="Copy to My Themes"
            onClick={handleCopy}
          />
        </Box>
      </Box>
    </Panel>
  );
};