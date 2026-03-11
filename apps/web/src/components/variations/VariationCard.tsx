import { Box, Typography, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { GameVariation } from "@snake/contracts";
import { IconActionButton } from "../shared/IconActionButton";
import { Panel } from "../shared/Panel";
import { approvedIcons } from "../../theme/approvedIcons";

interface VariationCardProps {
  variation: GameVariation;
  isActive?: boolean;
  onActivate: (id: string) => void;
  onEdit: (variation: GameVariation) => void;
  onDelete: (id: string) => void;
}

export const VariationCard = ({
  variation,
  isActive,
  onActivate,
  onEdit,
  onDelete
}: VariationCardProps) => {
  const theme = useTheme();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return theme.palette.success.main;
      case "medium":
        return theme.palette.warning.main;
      case "hard":
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  return (
    <Panel>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Typography variant="h6">{variation.name}</Typography>
          <Chip
            label={variation.difficulty}
            size="small"
            sx={{
              bgcolor: getDifficultyColor(variation.difficulty),
              color: "white",
              fontWeight: 600,
              textTransform: "capitalize"
            }}
          />
        </Box>

        <Typography
          variant="body2"
          sx={{ color: theme.ui.leaderboard.mutedText, mb: 2, minHeight: 40 }}
        >
          {variation.description}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          <Chip label={`Speed: ${variation.baseSpeed}`} size="small" variant="outlined" />
          <Chip label={`Grid: ${variation.baseGridSize}x${variation.baseGridSize}`} size="small" variant="outlined" />
          <Chip label={`${variation.maxConcurrentFoods} Food${variation.maxConcurrentFoods > 1 ? "s" : ""}`} size="small" variant="outlined" />
          <Chip label={`${variation.enabledPowerups.length} Powerup${variation.enabledPowerups.length > 1 ? "s" : ""}`} size="small" variant="outlined" />
        </Box>

        {isActive && (
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.success.main,
              fontWeight: 600,
              mb: 1
            }}
          >
            ✓ Currently Active
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          {!isActive && (
            <IconActionButton
              tone="primary"
              variant="contained"
              icon={<approvedIcons.check />}
              iconColor={theme.icons.check || theme.icons.default}
              label="Activate"
              onClick={() => onActivate(variation.id)}
            />
          )}
          <IconActionButton
            tone="neutral"
            variant="outlined"
            icon={<approvedIcons.edit />}
            iconColor={theme.icons.edit || theme.icons.default}
            label="Edit"
            onClick={() => onEdit(variation)}
          />
          <IconActionButton
            tone="danger"
            variant="outlined"
            icon={<approvedIcons.delete />}
            iconColor={theme.icons.delete || theme.icons.default}
            label="Delete"
            onClick={() => onDelete(variation.id)}
          />
        </Box>

        {variation.usageCount > 0 && (
          <Typography
            variant="caption"
            sx={{ color: theme.ui.leaderboard.mutedText, mt: 1, display: "block" }}
          >
            Played {variation.usageCount} time{variation.usageCount !== 1 ? "s" : ""}
          </Typography>
        )}
      </Box>
    </Panel>
  );
};