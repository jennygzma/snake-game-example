import { Box, Typography, Avatar, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { SharedVariationWithCreator } from "@snake/contracts";
import { Panel } from "../shared/Panel";
import { IconActionButton } from "../shared/IconActionButton";
import { approvedIcons } from "../../theme/approvedIcons";

interface HubVariationCardProps {
  variation: SharedVariationWithCreator;
  isFavorited?: boolean;
  onFavorite?: () => void;
  onUnfavorite?: () => void;
  onCopy?: () => void;
}

export const HubVariationCard = ({
  variation,
  isFavorited = false,
  onFavorite,
  onUnfavorite,
  onCopy
}: HubVariationCardProps) => {
  const muiTheme = useTheme();

  return (
    <Panel>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Header with creator info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            src={variation.creator.avatarBase64}
            alt={variation.creator.name}
            sx={{ width: 32, height: 32 }}
          >
            {variation.creator.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" sx={{ color: muiTheme.palette.text.secondary }}>
            {variation.creator.name}
          </Typography>
        </Box>

        {/* Variation name */}
        <Typography variant="h6" component="h3">
          {variation.name}
        </Typography>

        {/* Description */}
        {variation.description && (
          <Typography variant="body2" sx={{ color: muiTheme.palette.text.secondary }}>
            {variation.description}
          </Typography>
        )}

        {/* Variation details */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {variation.difficulty && (
            <Chip
              label={variation.difficulty}
              size="small"
              color={
                variation.difficulty === "easy"
                  ? "success"
                  : variation.difficulty === "hard"
                  ? "error"
                  : "warning"
              }
            />
          )}
          <Chip label={`Grid: ${variation.gridSize}x${variation.gridSize}`} size="small" />
          <Chip label={`Speed: ${variation.baseSpeed}`} size="small" />
          <Chip label={`Foods: ${variation.maxConcurrentFoods}`} size="small" />
        </Box>

        {/* Stats */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            label={`${variation.favoriteCount} favorites`}
            size="small"
            variant="outlined"
          />
          <Chip
            label={`${variation.usageCount} uses`}
            size="small"
            variant="outlined"
          />
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          {isFavorited ? (
            <IconActionButton
              tone="neutral"
              icon={<approvedIcons.check />}
              iconColor={muiTheme.icons.check || muiTheme.icons.default}
              label="Unfavorite"
              onClick={onUnfavorite}
              aria-label="Remove from favorites"
            />
          ) : (
            <IconActionButton
              tone="primary"
              icon={<approvedIcons.add />}
              iconColor={muiTheme.icons.add || muiTheme.icons.default}
              label="Favorite"
              onClick={onFavorite}
              aria-label="Add to favorites"
            />
          )}
          <IconActionButton
            tone="primary"
            icon={<approvedIcons.add />}
            iconColor={muiTheme.icons.add || muiTheme.icons.default}
            label="Copy"
            onClick={onCopy}
            aria-label="Copy variation to your collection"
          />
        </Box>
      </Box>
    </Panel>
  );
};