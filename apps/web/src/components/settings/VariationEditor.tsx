import { useEffect, useRef, useState } from "react";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import type { GameVariationInput, PowerupType } from "@snake/contracts";
import { IconActionButton } from "../shared/IconActionButton";
import { Panel } from "../shared/Panel";
import { AppButton } from "../shared/AppButton";
import { ColorPickerField } from "./ColorPickerField";
import { approvedIcons } from "../../theme/approvedIcons";

type VariationEditorProps = {
  initialData?: GameVariationInput;
  onSave: (data: GameVariationInput) => void;
  onCancel?: () => void;
};

const POWERUP_EFFECTS = [
  { value: "speed_increase", label: "Speed Increase" },
  { value: "speed_decrease", label: "Speed Decrease" },
  { value: "add_blocks", label: "Length Increase" },
  { value: "subtract_blocks", label: "Length Decrease" },
  { value: "double_points", label: "Extra Points" }
] as const;

const powerupDefaultForTheme = (defaultFoodColor: string): PowerupType => ({
  effect: "double_points",
  value: 2,
  color: defaultFoodColor
});

export const VariationEditor = ({ initialData, onSave, onCancel }: VariationEditorProps) => {
  const theme = useTheme();
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    initialData?.difficulty || "medium"
  );
  const [maxConcurrentFoods, setMaxConcurrentFoods] = useState(initialData?.maxConcurrentFoods || 1);
  const [baseSpeed, setBaseSpeed] = useState(initialData?.baseSpeed || 8);
  const [gridSize, setGridSize] = useState(initialData?.gridSize || 20);
  const [powerups, setPowerups] = useState<PowerupType[]>(
    initialData?.powerupTypes || [powerupDefaultForTheme(theme.game.food)]
  );
  const [snakeHeadImage, setSnakeHeadImage] = useState<string | undefined>(initialData?.snakeHeadImage);
  const [customColors, setCustomColors] = useState(initialData?.customColors);
  const snakeHeadInputRef = useRef<HTMLInputElement | null>(null);
  const foodImageInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    setName(initialData?.name || "");
    setDescription(initialData?.description || "");
    setDifficulty(initialData?.difficulty || "medium");
    setMaxConcurrentFoods(initialData?.maxConcurrentFoods || 1);
    setBaseSpeed(initialData?.baseSpeed || 8);
    setGridSize(initialData?.gridSize || 20);
    setPowerups(initialData?.powerupTypes || [powerupDefaultForTheme(theme.game.food)]);
    setSnakeHeadImage(initialData?.snakeHeadImage);
    setCustomColors(initialData?.customColors);
  }, [initialData, theme.game.food]);

  const handleAddPowerup = () => {
    setPowerups((current) => [...current, powerupDefaultForTheme(theme.game.food)]);
  };

  const handleRemovePowerup = (index: number) => {
    setPowerups((current) => current.filter((_, currentIndex) => currentIndex !== index));
  };

  const handlePowerupChange = (index: number, field: keyof PowerupType, value: string | number) => {
    setPowerups((current) =>
      current.map((powerup, currentIndex) =>
        currentIndex === index ? { ...powerup, [field]: value } : powerup
      )
    );
  };

  const handlePowerupImageUpload = (index: number, file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = typeof event.target?.result === "string" ? event.target.result : undefined;
      handlePowerupChange(index, "image", result ?? "");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      difficulty,
      maxConcurrentFoods,
      baseSpeed,
      gridSize,
      powerupTypes: powerups,
      snakeHeadImage,
      customColors
    });
  };

  return (
    <Panel>
      <Stack spacing={3}>
        <Typography variant="h5">{initialData ? "Edit Variation" : "Create New Variation"}</Typography>

        <TextField
          label="Variation Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          fullWidth
          required
          aria-label="Variation name"
        />

        <TextField
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          fullWidth
          multiline
          rows={2}
          aria-label="Variation description"
        />

        <FormControl fullWidth>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value as "easy" | "medium" | "hard")}
            label="Difficulty"
            aria-label="Difficulty level"
          >
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>

        <Box>
          <Typography gutterBottom>Max Concurrent Foods: {maxConcurrentFoods}</Typography>
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
          <Typography gutterBottom>Base Speed: {baseSpeed}</Typography>
          <Slider
            value={baseSpeed}
            onChange={(_, value) => setBaseSpeed(value as number)}
            min={1}
            max={30}
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
            min={8}
            max={64}
            step={2}
            marks
            valueLabelDisplay="auto"
            aria-label="Game board grid size"
          />
        </Box>

        <Stack spacing={1}>
          <Typography variant="h6">Visual Customization</Typography>
          <ColorPickerField
            label="Snake Color"
            value={customColors?.snake || theme.game.snake}
            onChange={(value) => setCustomColors((current) => ({ ...(current || {}), snake: value }))}
          />
          <ColorPickerField
            label="Snake Head Color"
            value={customColors?.snakeHead || theme.game.snakeHead}
            onChange={(value) => setCustomColors((current) => ({ ...(current || {}), snakeHead: value }))}
          />
          <ColorPickerField
            label="Board Background"
            value={customColors?.boardBg || theme.game.boardBg}
            onChange={(value) => setCustomColors((current) => ({ ...(current || {}), boardBg: value }))}
          />
          <ColorPickerField
            label="Board Grid"
            value={customColors?.boardGrid || theme.game.boardGrid}
            onChange={(value) => setCustomColors((current) => ({ ...(current || {}), boardGrid: value }))}
          />
        </Stack>

        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">Food Types and Powerups</Typography>
            <IconActionButton onClick={handleAddPowerup} label="Add food type" icon={<approvedIcons.add />} />
          </Box>

          <Stack spacing={2}>
            {powerups.map((powerup, index) => (
              <Panel key={`${powerup.effect}-${index}`} sx={{ borderColor: (muiTheme) => muiTheme.ui.shared.panelBorder }}>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="subtitle2">Food Type {index + 1}</Typography>
                    <IconButton
                      onClick={() => handleRemovePowerup(index)}
                      size="small"
                      aria-label={`Remove food type ${index + 1}`}
                    >
                      <approvedIcons.delete />
                    </IconButton>
                  </Box>

                  <FormControl fullWidth>
                    <InputLabel>Effect</InputLabel>
                    <Select
                      value={powerup.effect}
                      onChange={(event) => handlePowerupChange(index, "effect", event.target.value)}
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
                    label="Effect Value"
                    type="number"
                    value={powerup.value}
                    onChange={(event) => handlePowerupChange(index, "value", Number(event.target.value))}
                    fullWidth
                    inputProps={{ min: 1, max: 10 }}
                    aria-label={`Powerup ${index + 1} value`}
                  />

                  <ColorPickerField
                    label="Food Color"
                    value={powerup.color}
                    onChange={(value) => handlePowerupChange(index, "color", value)}
                  />

                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Food Image (Optional)
                    </Typography>
                    <input
                      ref={(element) => {
                        foodImageInputRefs.current[index] = element;
                      }}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(event) => handlePowerupImageUpload(index, event.target.files?.[0])}
                      aria-label={`Upload image for food type ${index + 1}`}
                    />
                    <IconActionButton
                      variant="outlined"
                      tone="neutral"
                      icon={<approvedIcons.photoCamera />}
                      label={`Choose image for food type ${index + 1}`}
                      onClick={() => foodImageInputRefs.current[index]?.click()}
                    />
                    {powerup.image ? (
                      <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                        <img
                          src={powerup.image}
                          alt={`Food type ${index + 1} preview`}
                          style={{ maxWidth: "48px", maxHeight: "48px", display: "block" }}
                        />
                        <AppButton
                          variant="outlined"
                          tone="neutral"
                          onClick={() => handlePowerupChange(index, "image", "")}
                        >
                          Remove image
                        </AppButton>
                      </Box>
                    ) : null}
                  </Box>
                </Stack>
              </Panel>
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Snake Head Image (Optional)
          </Typography>
          {snakeHeadImage ? (
            <Box sx={{ mb: 2 }}>
              <img
                src={snakeHeadImage}
                alt="Snake head preview"
                style={{ maxWidth: "100px", maxHeight: "100px", display: "block" }}
              />
              <AppButton variant="outlined" tone="neutral" onClick={() => setSnakeHeadImage(undefined)} sx={{ mt: 1 }}>
                Remove image
              </AppButton>
            </Box>
          ) : null}
          <input
            ref={snakeHeadInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (loadEvent) => {
                const result = loadEvent.target?.result;
                if (typeof result === "string") {
                  setSnakeHeadImage(result);
                }
              };
              reader.readAsDataURL(file);
            }}
            aria-label="Upload snake head image"
          />
          <IconActionButton
            variant="outlined"
            tone="neutral"
            icon={<approvedIcons.photoCamera />}
            label="Choose snake head image"
            onClick={() => snakeHeadInputRef.current?.click()}
          />
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {onCancel ? (
            <AppButton tone="neutral" variant="outlined" onClick={onCancel}>
              Cancel
            </AppButton>
          ) : null}
          <AppButton onClick={handleSubmit} disabled={!name.trim() || powerups.length === 0}>
            Save Variation
          </AppButton>
        </Stack>
      </Stack>
    </Panel>
  );
};
