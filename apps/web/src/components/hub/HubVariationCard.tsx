import { createElement } from "react";
import { Box, Typography, Chip } from "@mui/material";
import type { SharedVariationWithCreator } from "@snake/contracts";
import { Panel } from "../shared/Panel";
import { ProfileAvatar } from "../shared/ProfileAvatar";
import { IconActionButton } from "../shared/IconActionButton";
import { approvedIcons } from "../../theme/approvedIcons";

interface HubVariationCardProps {
  variation: SharedVariationWithCreator;
  isFavorited?: boolean;
  onFavorite: (variationId: string) => void;
  onUnfavorite: (variationId: string) => void;
  onCopy: (variationId: string) => void;
}

export const HubVariationCard = ({
  variation,
  isFavorited = false,
  onFavorite,
  onUnfavorite,
  onCopy
}: HubVariationCardProps) => {
  const handleFavoriteToggle = () => {
    if (isFavorited) {
      onUnfavorite(variation.id);
    } else {
      onFavorite(variation.id);
    }
  };

  const handleCopy = () => {
    onCopy(variation.id);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "easy":
        return "#4caf50";
      case "medium":
        return "#ff9800";
      case "hard":
        return "#f44336";
      default:
        return "#9e9e9e";
    }
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
      {/* Variation Info */}
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography variant="h6">{variation.name}</Typography>
          {variation.difficulty && (
            <Chip
              label={variation.difficulty}
              size="small"
              sx={{
                bgcolor: getDifficultyColor(variation.difficulty),
                color: "#fff",
                fontWeight: 600,
                textTransform: "capitalize"
              }}
            />
          )}
        </Box>
        {variation.description && (
          <Typography
            variant="body2"
            sx={{
              color: (theme) => theme.palette.text.secondary,
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {variation.description}
          </Typography>
        )}

        {/* Variation Stats */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          <Chip label={`Speed: ${variation.baseSpeed}`} size="small" variant="outlined" />
          <Chip label={`Grid: ${variation.gridSize}x${variation.gridSize}`} size="small" variant="outlined" />
          <Chip label={`Foods: ${variation.maxConcurrentFoods}`} size="small" variant="outlined" />
          {variation.powerupTypes.length > 0 && (
            <Chip label={`${variation.powerupTypes.length} powerups`} size="small" variant="outlined" />
          )}
        </Box>
      </Box>

      {/* Creator Info */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <ProfileAvatar src={variation.creator.avatarBase64} size={32} />
        <Typography variant="body2" sx={{ color: (theme) => theme.palette.text.secondary }}>
          by {variation.creator.name}
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
            label={variation.favoriteCount}
            size="small"
            variant="outlined"
          />
          <Chip label={`${variation.usageCount} copies`} size="small" variant="outlined" />
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconActionButton
            icon={createElement(isFavorited ? approvedIcons.favorite : approvedIcons.favoriteBorder)}
            label={isFavorited ? "Unfavorite" : "Favorite"}
            onClick={handleFavoriteToggle}
          />
          <IconActionButton
            icon={createElement(approvedIcons.contentCopy)}
            label="Copy to My Variations"
            onClick={handleCopy}
          />
        </Box>
      </Box>
    </Panel>
  );
};