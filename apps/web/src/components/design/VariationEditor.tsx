import { Box, Typography, TextField, MenuItem, Slider, Stack, Divider } from "@mui/material";
import { useState } from "react";
import { Panel } from "../shared/Panel";
import { AppButton } from "../shared/AppButton";
import { ColorPickerField } from "../settings/ColorPickerField";
import { AvatarUpload } from "../profile/AvatarUpload";
import type { GameVariationInput, PowerupType, Difficulty } from "@snake/contracts";

type VariationEditorProps = {
  initialValue?: Partial<GameVariationInput>;
  onSave?: (variation: GameVariationInput) => void;
  onCancel?: () => void;
};

export const VariationEditor = ({
  initialValue,
  onSave,
  onCancel
}: VariationEditorProps) => {
  const [name, setName] = useState(initialValue?.name || "");
  const [description, setDescription] = useState(initialValue?.description || "");
  const [difficulty, setDifficulty] = useState<Difficulty>(initialValue?.difficulty || "medium");
  const [snakeHeadImage, setSnakeHeadImage] = useState(initialValue?.snakeHeadImage);
  const [boardBackgroundColor, setBoardBackgroundColor] = useState(initialValue?.boardBackgroundColor || "#000000");
  const [baseSpeed, setBaseSpeed] = useState(initialValue?.baseSpeed || 8);
  const [gridSize, setGridSize] = useState(initialValue?.gridSize || 20);
  const [maxConcurrentFoods, setMaxConcurrentFoods] = useState(initialValue?.maxConcurrentFoods || 1);

  // Simplified powerup management - start with one default powerup
  const [powerups] = useState<PowerupType[]>(
    initialValue?.powerups || [
      {
        id: "default",
        effect: "points_multiplier",
        value: 1,
        color: "#87ae73"
      }
    ]
  );

  const handleSave = () => {
    if (!name.trim()) return;

    const variation: GameVariationInput = {
      profileId: "", // Will be set by the service
      name: name.trim(),
      description: description.trim() || undefined,
      difficulty,
      snakeHeadImage,
      boardBackgroundColor: boardBackgroundColor || undefined,
      powerups,
      maxConcurrentFoods,
      baseSpeed,
      gridSize
    };

    onSave?.(variation);
  };

  return (
    <Panel>
      <Typography variant="h6" sx={{ mb: 3 }}>
        {initialValue ? "Edit Variation" : "Create New Variation"}
      </Typography>

      <Stack spacing={3}>
        {/* Basic Info */}
        <TextField
          label="Variation Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={2}
        />

        <TextField
          label="Difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          select
          fullWidth
        >
          <MenuItem value="easy">Easy</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="hard">Hard</MenuItem>
          <MenuItem value="custom">Custom</MenuItem>
        </TextField>

        <Divider />

        {/* Visual Customization */}
        <Typography variant="subtitle1" fontWeight="bold">
          Visual Customization
        </Typography>

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Snake Head Image
          </Typography>
          <AvatarUpload
            currentAvatar={snakeHeadImage || null}
            onAvatarChange={(base64) => setSnakeHeadImage(base64 || undefined)}
          />
        </Box>

        <ColorPickerField
          label="Board Background Color"
          value={boardBackgroundColor}
          onChange={setBoardBackgroundColor}
        />

        <Divider />

        {/* Game Rules */}
        <Typography variant="subtitle1" fontWeight="bold">
          Game Rules
        </Typography>

        <Box>
          <Typography variant="body2" gutterBottom>
            Base Speed: {baseSpeed}
          </Typography>
          <Slider
            value={baseSpeed}
            onChange={(_e, value) => setBaseSpeed(value as number)}
            min={1}
            max={30}
            marks
            valueLabelDisplay="auto"
          />
        </Box>

        <Box>
          <Typography variant="body2" gutterBottom>
            Grid Size: {gridSize}x{gridSize}
          </Typography>
          <Slider
            value={gridSize}
            onChange={(_e, value) => setGridSize(value as number)}
            min={8}
            max={64}
            step={2}
            marks
            valueLabelDisplay="auto"
          />
        </Box>

        <Box>
          <Typography variant="body2" gutterBottom>
            Max Concurrent Foods: {maxConcurrentFoods}
          </Typography>
          <Slider
            value={maxConcurrentFoods}
            onChange={(_e, value) => setMaxConcurrentFoods(value as number)}
            min={1}
            max={10}
            marks
            valueLabelDisplay="auto"
          />
        </Box>

        <Divider />

        {/* Actions */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {onCancel && (
            <AppButton onClick={onCancel} variant="outlined">
              Cancel
            </AppButton>
          )}
          <AppButton onClick={handleSave} variant="contained" disabled={!name.trim()}>
            {initialValue ? "Update" : "Create"}
          </AppButton>
        </Stack>
      </Stack>
    </Panel>
  );
};