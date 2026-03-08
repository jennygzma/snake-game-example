import { Alert, Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useState } from "react";
import type { ThemeColors, ThemeIconColors } from "@snake/contracts";
import { gameTokens } from "../../theme/tokens";
import { ColorPickerField } from "./ColorPickerField";
import { FontPicker } from "./FontPicker";

type ThemeEditorProps = {
  initialColors?: ThemeColors;
  initialIconColors?: ThemeIconColors;
  initialFontFamily?: string;
  onSave: (data: { colors: ThemeColors; iconColors: ThemeIconColors; fontFamily: string }) => void;
  onCancel?: () => void;
};

const DEFAULT_COLORS: ThemeColors = gameTokens.colors;
const DEFAULT_ICON_COLORS: ThemeIconColors = { default: "#172018" };
const DEFAULT_FONT = "'Space Grotesk', 'Avenir Next', 'Segoe UI', sans-serif";

export const ThemeEditor = ({
  initialColors = DEFAULT_COLORS,
  initialIconColors = DEFAULT_ICON_COLORS,
  initialFontFamily = DEFAULT_FONT,
  onSave,
  onCancel
}: ThemeEditorProps) => {
  const [colors, setColors] = useState<ThemeColors>(initialColors);
  const [iconColors, setIconColors] = useState<ThemeIconColors>(initialIconColors);
  const [fontFamily, setFontFamily] = useState(initialFontFamily);

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const handleIconColorChange = (key: keyof ThemeIconColors, value: string) => {
    setIconColors((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave({ colors, iconColors, fontFamily });
  };

  const handleReset = () => {
    setColors(DEFAULT_COLORS);
    setIconColors(DEFAULT_ICON_COLORS);
    setFontFamily(DEFAULT_FONT);
  };

  return (
    <Stack spacing={3}>
      <Alert severity="info">
        Customize all aspects of the app's appearance. Changes are previewed in real-time.
      </Alert>

      <Box>
        <Typography variant="h6" gutterBottom>
          Font
        </Typography>
        <FontPicker value={fontFamily} onChange={setFontFamily} />
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6" gutterBottom>
          Game Colors
        </Typography>
        <Stack spacing={2}>
          <ColorPickerField label="Background" value={colors.bg} onChange={(v) => handleColorChange("bg", v)} />
          <ColorPickerField label="Panel" value={colors.panel} onChange={(v) => handleColorChange("panel", v)} />
          <ColorPickerField label="Panel Border" value={colors.panelBorder} onChange={(v) => handleColorChange("panelBorder", v)} />
          <ColorPickerField label="Text" value={colors.text} onChange={(v) => handleColorChange("text", v)} />
          <ColorPickerField label="Text Muted" value={colors.textMuted} onChange={(v) => handleColorChange("textMuted", v)} />
        </Stack>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6" gutterBottom>
          Game Elements
        </Typography>
        <Stack spacing={2}>
          <ColorPickerField label="Snake" value={colors.snake} onChange={(v) => handleColorChange("snake", v)} />
          <ColorPickerField label="Snake Head" value={colors.snakeHead} onChange={(v) => handleColorChange("snakeHead", v)} />
          <ColorPickerField label="Food" value={colors.food} onChange={(v) => handleColorChange("food", v)} />
          <ColorPickerField label="Board Grid" value={colors.boardGrid} onChange={(v) => handleColorChange("boardGrid", v)} />
          <ColorPickerField label="Board Background" value={colors.boardBg} onChange={(v) => handleColorChange("boardBg", v)} />
        </Stack>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6" gutterBottom>
          Button Colors
        </Typography>
        <Stack spacing={2}>
          <ColorPickerField label="Action" value={colors.action} onChange={(v) => handleColorChange("action", v)} />
          <ColorPickerField label="Action Hover" value={colors.actionHover} onChange={(v) => handleColorChange("actionHover", v)} />
          <ColorPickerField label="Action Text" value={colors.actionText} onChange={(v) => handleColorChange("actionText", v)} />
          <ColorPickerField label="Pause" value={colors.pause} onChange={(v) => handleColorChange("pause", v)} />
          <ColorPickerField label="Pause Hover" value={colors.pauseHover} onChange={(v) => handleColorChange("pauseHover", v)} />
          <ColorPickerField label="Pause Text" value={colors.pauseText} onChange={(v) => handleColorChange("pauseText", v)} />
          <ColorPickerField label="Neutral" value={colors.neutral} onChange={(v) => handleColorChange("neutral", v)} />
          <ColorPickerField label="Neutral Hover" value={colors.neutralHover} onChange={(v) => handleColorChange("neutralHover", v)} />
          <ColorPickerField label="Neutral Text" value={colors.neutralText} onChange={(v) => handleColorChange("neutralText", v)} />
          <ColorPickerField label="Danger" value={colors.danger} onChange={(v) => handleColorChange("danger", v)} />
          <ColorPickerField label="Danger Hover" value={colors.dangerHover} onChange={(v) => handleColorChange("dangerHover", v)} />
          <ColorPickerField label="Danger Text" value={colors.dangerText} onChange={(v) => handleColorChange("dangerText", v)} />
        </Stack>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6" gutterBottom>
          Icon Colors (Optional)
        </Typography>
        <Stack spacing={2}>
          <ColorPickerField label="Default Icon Color" value={iconColors.default} onChange={(v) => handleIconColorChange("default", v)} />
        </Stack>
      </Box>

      <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
        <Button variant="contained" onClick={handleSave}>
          Save Theme
        </Button>
        <Button variant="outlined" onClick={handleReset}>
          Reset to Defaults
        </Button>
        {onCancel && (
          <Button onClick={onCancel}>
            Cancel
          </Button>
        )}
      </Stack>
    </Stack>
  );
};