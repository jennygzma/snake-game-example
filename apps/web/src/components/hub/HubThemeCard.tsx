import { Box, Typography, Avatar, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { SharedThemeWithCreator } from "@snake/contracts";
import { Panel } from "../shared/Panel";
import { IconActionButton } from "../shared/IconActionButton";
import { approvedIcons } from "../../theme/approvedIcons";

interface HubThemeCardProps {
  theme: SharedThemeWithCreator;
  isFavorited?: boolean;
  onFavorite?: () => void;
  onUnfavorite?: () => void;
  onCopy?: () => void;
}

export const HubThemeCard = ({
  theme,
  isFavorited = false,
  onFavorite,
  onUnfavorite,
  onCopy
}: HubThemeCardProps) => {
  const muiTheme = useTheme();

  return (
    <Panel>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Header with creator info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            src={theme.creator.avatarBase64}
            alt={theme.creator.name}
            sx={{ width: 32, height: 32 }}
          >
            {theme.creator.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" sx={{ color: muiTheme.palette.text.secondary }}>
            {theme.creator.name}
          </Typography>
        </Box>

        {/* Theme name */}
        <Typography variant="h6" component="h3">
          {theme.name}
        </Typography>

        {/* Description */}
        {theme.description && (
          <Typography variant="body2" sx={{ color: muiTheme.palette.text.secondary }}>
            {theme.description}
          </Typography>
        )}

        {/* Color preview */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {[
            theme.colors.snake,
            theme.colors.food,
            theme.colors.action,
            theme.colors.panel
          ].map((color, idx) => (
            <Box
              key={idx}
              sx={{
                width: 40,
                height: 40,
                backgroundColor: color,
                border: `1px solid ${muiTheme.palette.divider}`,
                borderRadius: `${muiTheme.shape.borderRadius}px`
              }}
              aria-label={`Color ${idx + 1}`}
            />
          ))}
        </Box>

        {/* Stats */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            label={`${theme.favoriteCount} favorites`}
            size="small"
            variant="outlined"
          />
          <Chip
            label={`${theme.usageCount} uses`}
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
            aria-label="Copy theme to your collection"
          />
        </Box>
      </Box>
    </Panel>
  );
};