import { Box, Typography, Card, CardContent, CardActions, Stack, Chip } from "@mui/material";
import { IconActionButton } from "../shared/IconActionButton";
import { Panel } from "../shared/Panel";
import { Edit, Delete, CheckCircle } from "@mui/icons-material";
import type { GameVariation } from "@snake/contracts";

type VariationListProps = {
  variations?: GameVariation[];
  onEdit?: (variation: GameVariation) => void;
  onDelete?: (id: string) => void;
  onActivate?: (id: string) => void;
};

export const VariationList = ({
  variations = [],
  onEdit,
  onDelete,
  onActivate
}: VariationListProps) => {
  if (variations.length === 0) {
    return (
      <Panel>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
          No variations yet. Create your first game variation below.
        </Typography>
      </Panel>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Your Game Variations
      </Typography>
      <Stack spacing={2}>
        {variations.map((variation) => (
          <Card key={variation.id} variant="outlined">
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6">{variation.name}</Typography>
                {variation.isActive && (
                  <Chip
                    label="Active"
                    color="primary"
                    size="small"
                    icon={<CheckCircle />}
                  />
                )}
              </Stack>
              
              {variation.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {variation.description}
                </Typography>
              )}
              
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Chip label={`Difficulty: ${variation.difficulty}`} size="small" />
                <Chip label={`${variation.powerups.length} powerups`} size="small" />
                <Chip label={`Speed: ${variation.baseSpeed}`} size="small" />
                <Chip label={`Grid: ${variation.gridSize}x${variation.gridSize}`} size="small" />
                <Chip label={`Played: ${variation.usageCount} times`} size="small" />
              </Stack>
            </CardContent>
            
            <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
              {!variation.isActive && onActivate && (
                <IconActionButton
                  icon={<CheckCircle />}
                  label="Activate"
                  onClick={() => onActivate(variation.id)}
                  iconOnly
                />
              )}
              {onEdit && (
                <IconActionButton
                  icon={<Edit />}
                  label="Edit"
                  onClick={() => onEdit(variation)}
                  iconOnly
                />
              )}
              {onDelete && (
                <IconActionButton
                  icon={<Delete />}
                  label="Delete"
                  onClick={() => onDelete(variation.id)}
                  iconOnly
                />
              )}
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};