import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Stack,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  useTheme
} from "@mui/material";
import type { GameVariationInput, PowerupType } from "@snake/contracts";
import { Panel } from "../shared/Panel";
import { AppButton } from "../shared/AppButton";
import { IconActionButton } from "../shared/IconActionButton";
import { approvedIcons } from "../../theme/approvedIcons";
import { ColorPickerField } from "./ColorPickerField";

type VariationEditorProps = {
  initialData?: GameVariationInput;
  onSave: (data: GameVariationInput) => void;
  onCancel?: () => void;
};

const POWERUP_EFFECTS = [
  { value: "speed_increase", label: "Speed Increase" },
  { value: "speed_decrease", label: "Speed Decrease" },
  { value: "add_blocks", label: "Add Blocks" },
  { value: "subtract_blocks", label: "Subtract Blocks" },
  { value: "double_points", label: "Double Points" }
] as const;

export const VariationEditor = ({ initialData, onSave, onCancel }: VariationEditorProps) => {
  const theme = useTheme();
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    initialData?.difficulty || "medium"
  );
  const [maxConcurrentFoods, setMaxConcurrentFoods] = useState(
    initialData?.maxConcurrentFoods || 1
  );
  const [baseSpeed, setBaseSpeed] = useState(initialData?.baseSpeed || 10);
  const [gridSize, setGridSize] = useState(initialData?.gridSize || 20);
  const [powerups, setPowerups] = useState<PowerupType[]>(
    initialData?.powerupTypes || [
      { effect: "double_points", value: 2, color: "#FDB813" }
    ]
  );
  const [snakeHeadImage, setSnakeHeadImage] = useState<string | undefined>(
    initialData?.snakeHeadImage
  );

  const handleAddPowerup = () => {
    setPowerups([
      ...powerups,
      { effect: "speed_increase", value: 1, color: "#87ae73" }
    ]);
  };

  const handleRemovePowerup = (index: number) => {
    setPowerups(powerups.filter((_, i) => i !== index));
  };

  const handlePowerupChange = (
    index: number,
    field: keyof PowerupType,
    value: string | number
  ) => {
    const updated = [...powerups];
    if (updated[index]) {
      updated[index] = { ...updated[index]!, [field]: value };
      setPowerups(updated);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      difficulty,
      maxConcurrentFoods,
      baseSpeed,
      gridSize,
      powerupTypes: powerups,
      snakeHeadImage
    });
  };

  return (
    <Panel>
      <Stack spacing={3}>
        <Typography variant="h5">
          {initialData ? "Edit Variation" : "Create New Variation"}
        </Typography>

        <TextField
          label="Variation Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          aria-label="Variation name"
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={2}
          aria-label="Variation description"
        />

        <FormControl fullWidth>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
            label="Difficulty"
            aria-label="Difficulty level"
          >
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>

        <Box>
          <Typography gutterBottom>
            Max Concurrent Foods: {maxConcurrentFoods}
          </Typography>
          <Slider
            value={maxConcurrentFoods}
            onChange={(_, value) => setMaxConcurrentFoods(value as number)}
            min={1}
            max={5}
            marks
            valueLabelDisplay="auto"
            aria-label="Maximum concurrent foods"
          />
        </Box>

        <Box>
          <Typography gutterBottom>Base Speed: {baseSpeed}</Typography>
          <Slider
            value={baseSpeed}
            onChange={(_, value) => setBaseSpeed(value as number)}
            min={5}
            max={20}
            marks
            valueLabelDisplay="auto"
            aria-label="Base game speed"
          />
        </Box>

        <Box>
          <Typography gutterBottom>Grid Size: {gridSize}</Typography>
          <Slider
            value={gridSize}
            onChange={(_, value) => setGridSize(value as number)}
            min={10}
            max={30}
            step={2}
            marks
            valueLabelDisplay="auto"
            aria-label="Game board grid size"
          />
        </Box>

        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">Powerups</Typography>
            <IconActionButton
              onClick={handleAddPowerup}
              label="Add"
              icon={<approvedIcons.add />}
            />
          </Box>

          <Stack spacing={2}>
            {powerups.map((powerup, index) => (
              <Panel key={index} sx={{ bgcolor: theme.ui.gameBoard.border, opacity: 0.1 }}>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="subtitle2">Powerup {index + 1}</Typography>
                    <IconButton
                      onClick={() => handleRemovePowerup(index)}
                      size="small"
                      aria-label={`Remove powerup ${index + 1}`}
                    >
                      <approvedIcons.delete />
                    </IconButton>
                  </Box>

                  <FormControl fullWidth>
                    <InputLabel>Effect</InputLabel>
                    <Select
                      value={powerup.effect}
                      onChange={(e) =>
                        handlePowerupChange(index, "effect", e.target.value)
                      }
                      label="Effect"
                      aria-label={`Powerup ${index + 1} effect type`}
                    >
                      {POWERUP_EFFECTS.map((effect) => (
                        <MenuItem key={effect.value} value={effect.value}>
                          {effect.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Value"
                    type="number"
                    value={powerup.value}
                    onChange={(e) =>
                      handlePowerupChange(index, "value", Number(e.target.value))
                    }
                    fullWidth
                    inputProps={{ min: 1, max: 10 }}
                    aria-label={`Powerup ${index + 1} value`}
                  />

                  <ColorPickerField
                    label="Color"
                    value={powerup.color}
                    onChange={(color) => handlePowerupChange(index, "color", color)}
                  />
                </Stack>
              </Panel>
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Snake Head Image (Optional)
          </Typography>
          <Typography variant="body2" sx={{ color: theme.ui.leaderboard.mutedText, mb: 1 }}>
            Upload a custom image for the snake head. Leave empty to use default.
          </Typography>
          {snakeHeadImage && (
            <Box sx={{ mb: 2 }}>
              <img
                src={snakeHeadImage}
                alt="Snake head preview"
                style={{ maxWidth: "100px", maxHeight: "100px", display: "block" }}
              />
              <AppButton
                onClick={() => setSnakeHeadImage(undefined)}
                sx={{ mt: 1 }}
              >
                Remove Image
              </AppButton>
            </Box>
          )}
          {!snakeHeadImage && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setSnakeHeadImage(event.target?.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              aria-label="Upload snake head image"
            />
          )}
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {onCancel && (
            <AppButton onClick={onCancel}>
              Cancel
            </AppButton>
          )}
          <AppButton
            onClick={handleSubmit}
            disabled={!name.trim() || powerups.length === 0}
          >
            Save Variation
          </AppButton>
        </Stack>
      </Stack>
    </Panel>
  );
};