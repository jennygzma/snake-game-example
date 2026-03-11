import { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Slider,
  Typography,
  FormControl,
  InputLabel,
  Stack,
  useTheme
} from "@mui/material";
import type { GameVariation, GameVariationInput, PowerupType } from "@snake/contracts";
import { AppButton } from "../shared/AppButton";
import { IconActionButton } from "../shared/IconActionButton";
import { Panel } from "../shared/Panel";
import { AddCircleOutline, Delete } from "@mui/icons-material";

type VariationEditorProps = {
  variation?: GameVariation;
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

const DEFAULT_POWERUP: PowerupType = {
  effect: "double_points" as const,
  value: 1,
  color: "#87ae73"
};

export const VariationEditor = ({ variation, onSave, onCancel }: VariationEditorProps) => {
  const theme = useTheme();
  
  const [name, setName] = useState(variation?.name || "");
  const [description, setDescription] = useState(variation?.description || "");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(variation?.difficulty || "medium");
  const [baseSpeed, setBaseSpeed] = useState(variation?.baseSpeed || 8);
  const [gridSize, setGridSize] = useState(variation?.gridSize || 20);
  const [maxConcurrentFoods, setMaxConcurrentFoods] = useState(variation?.maxConcurrentFoods || 1);
  const [snakeHeadImage, setSnakeHeadImage] = useState(variation?.snakeHeadImage || "");
  const [powerups, setPowerups] = useState<PowerupType[]>(
    variation?.powerupTypes || [DEFAULT_POWERUP]
  );

  const handleAddPowerup = () => {
    setPowerups([...powerups, {
      effect: DEFAULT_POWERUP.effect,
      value: DEFAULT_POWERUP.value,
      color: DEFAULT_POWERUP.color
    }]);
  };

  const handleRemovePowerup = (index: number) => {
    if (powerups.length > 1) {
      setPowerups(powerups.filter((_, i) => i !== index));
    }
  };

  const handlePowerupChange = (index: number, field: keyof PowerupType, value: string | number) => {
    const updated = [...powerups];
    const current = updated[index];
    if (current) {
      updated[index] = { ...current, [field]: value } as PowerupType;
      setPowerups(updated);
    }
  };

  const handleSave = () => {
    const data: GameVariationInput = {
      name,
      description: description || undefined,
      difficulty,
      baseSpeed,
      gridSize,
      maxConcurrentFoods,
      snakeHeadImage: snakeHeadImage || undefined,
      powerupTypes: powerups
    };
    onSave(data);
  };

  const isValid = name.trim().length > 0 && powerups.length > 0;

  return (
    <Panel>
      <Stack spacing={3}>
        <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
          {variation ? "Edit Variation" : "Create New Variation"}
        </Typography>

        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          inputProps={{ "aria-label": "Variation name" }}
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={2}
          inputProps={{ "aria-label": "Variation description" }}
        />

        <FormControl fullWidth>
          <InputLabel id="difficulty-label">Difficulty</InputLabel>
          <Select
            labelId="difficulty-label"
            value={difficulty}
            label="Difficulty"
            onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
            inputProps={{ "aria-label": "Difficulty level" }}
          >
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>

        <Box>
          <Typography gutterBottom sx={{ color: theme.palette.text.secondary }}>
            Base Speed: {baseSpeed}
          </Typography>
          <Slider
            value={baseSpeed}
            onChange={(_, value) => setBaseSpeed(value as number)}
            min={1}
            max={30}
            marks
            valueLabelDisplay="auto"
            aria-label="Base speed"
          />
        </Box>

        <Box>
          <Typography gutterBottom sx={{ color: theme.palette.text.secondary }}>
            Grid Size: {gridSize}
          </Typography>
          <Slider
            value={gridSize}
            onChange={(_, value) => setGridSize(value as number)}
            min={8}
            max={64}
            marks
            step={4}
            valueLabelDisplay="auto"
            aria-label="Grid size"
          />
        </Box>

        <Box>
          <Typography gutterBottom sx={{ color: theme.palette.text.secondary }}>
            Max Concurrent Foods: {maxConcurrentFoods}
          </Typography>
          <Slider
            value={maxConcurrentFoods}
            onChange={(_, value) => setMaxConcurrentFoods(value as number)}
            min={1}
            max={10}
            marks
            valueLabelDisplay="auto"
            aria-label="Maximum concurrent foods"
          />
        </Box>

        <Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
              Powerups
            </Typography>
            <IconActionButton
              icon={<AddCircleOutline />}
              label="Add powerup"
              onClick={handleAddPowerup}
              aria-label="Add powerup"
              size="small"
              iconOnly
            />
          </Box>

          <Stack spacing={2}>
            {powerups.map((powerup, index) => (
              <Panel key={index}>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>
                      Powerup {index + 1}
                    </Typography>
                    {powerups.length > 1 && (
                      <IconActionButton
                        icon={<Delete />}
                        label="Remove"
                        onClick={() => handleRemovePowerup(index)}
                        aria-label={`Remove powerup ${index + 1}`}
                        size="small"
                        iconOnly
                      />
                    )}
                  </Box>

                  <FormControl fullWidth size="small">
                    <InputLabel>Effect</InputLabel>
                    <Select
                      value={powerup.effect}
                      label="Effect"
                      onChange={(e) => handlePowerupChange(index, "effect", e.target.value)}
                      inputProps={{ "aria-label": `Powerup ${index + 1} effect` }}
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
                    onChange={(e) => handlePowerupChange(index, "value", Number(e.target.value))}
                    fullWidth
                    size="small"
                    inputProps={{ min: 1, "aria-label": `Powerup ${index + 1} value` }}
                  />

                  <TextField
                    label="Color"
                    type="color"
                    value={powerup.color}
                    onChange={(e) => handlePowerupChange(index, "color", e.target.value)}
                    fullWidth
                    size="small"
                    inputProps={{ "aria-label": `Powerup ${index + 1} color` }}
                  />
                </Stack>
              </Panel>
            ))}
          </Stack>
        </Box>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          {onCancel && (
            <AppButton onClick={onCancel} variant="outlined">
              Cancel
            </AppButton>
          )}
          <AppButton onClick={handleSave} disabled={!isValid}>
            {variation ? "Save Changes" : "Create Variation"}
          </AppButton>
        </Box>
      </Stack>
    </Panel>
  );
};