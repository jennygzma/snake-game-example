import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { ThemeColors, ThemeIconColors } from "@snake/contracts";
import { gameTokens } from "../../theme/tokens";
import { Panel } from "../shared/Panel";
import { ColorPickerField } from "./ColorPickerField";
import { FontPicker } from "./FontPicker";

type ThemeEditorProps = {
  initialColors?: ThemeColors;
  initialIconColors?: ThemeIconColors;
  initialFontFamily?: string;
  onSave: (colors: ThemeColors, iconColors: ThemeIconColors, fontFamily: string) => void;
  onReset: () => void;
};

const defaultIconColors: ThemeIconColors = {
  default: gameTokens.colors.text
};

export const ThemeEditor = ({
  initialColors = gameTokens.colors,
  initialIconColors = defaultIconColors,
  initialFontFamily = "'Space Grotesk', 'Avenir Next', 'Segoe UI', sans-serif",
  onSave,
  onReset
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
    onSave(colors, iconColors, fontFamily);
  };

  const handleReset = () => {
    setColors(gameTokens.colors);
    setIconColors(defaultIconColors);
    setFontFamily("'Space Grotesk', 'Avenir Next', 'Segoe UI', sans-serif");
    onReset();
  };

  return (
    <Panel>
      <Stack spacing={3}>
        <Typography variant="h5">Theme Editor</Typography>

        <FontPicker value={fontFamily} onChange={setFontFamily} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Main Colors
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)"
              }
            }}
          >
            <ColorPickerField label="Background" value={colors.bg} onChange={(v) => handleColorChange("bg", v)} />
            <ColorPickerField label="Panel" value={colors.panel} onChange={(v) => handleColorChange("panel", v)} />
            <ColorPickerField
              label="Panel Border"
              value={colors.panelBorder}
              onChange={(v) => handleColorChange("panelBorder", v)}
            />
            <ColorPickerField label="Text" value={colors.text} onChange={(v) => handleColorChange("text", v)} />
            <ColorPickerField
              label="Text Muted"
              value={colors.textMuted}
              onChange={(v) => handleColorChange("textMuted", v)}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Game Colors
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)"
              }
            }}
          >
            <ColorPickerField label="Snake" value={colors.snake} onChange={(v) => handleColorChange("snake", v)} />
            <ColorPickerField
              label="Snake Head"
              value={colors.snakeHead}
              onChange={(v) => handleColorChange("snakeHead", v)}
            />
            <ColorPickerField label="Food" value={colors.food} onChange={(v) => handleColorChange("food", v)} />
            <ColorPickerField
              label="Board Grid"
              value={colors.boardGrid}
              onChange={(v) => handleColorChange("boardGrid", v)}
            />
            <ColorPickerField
              label="Board Background"
              value={colors.boardBg}
              onChange={(v) => handleColorChange("boardBg", v)}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Button Colors
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)"
              }
            }}
          >
            <ColorPickerField label="Action" value={colors.action} onChange={(v) => handleColorChange("action", v)} />
            <ColorPickerField
              label="Action Hover"
              value={colors.actionHover}
              onChange={(v) => handleColorChange("actionHover", v)}
            />
            <ColorPickerField
              label="Action Text"
              value={colors.actionText}
              onChange={(v) => handleColorChange("actionText", v)}
            />
            <ColorPickerField label="Pause" value={colors.pause} onChange={(v) => handleColorChange("pause", v)} />
            <ColorPickerField
              label="Pause Hover"
              value={colors.pauseHover}
              onChange={(v) => handleColorChange("pauseHover", v)}
            />
            <ColorPickerField
              label="Pause Text"
              value={colors.pauseText}
              onChange={(v) => handleColorChange("pauseText", v)}
            />
            <ColorPickerField
              label="Neutral"
              value={colors.neutral}
              onChange={(v) => handleColorChange("neutral", v)}
            />
            <ColorPickerField
              label="Neutral Hover"
              value={colors.neutralHover}
              onChange={(v) => handleColorChange("neutralHover", v)}
            />
            <ColorPickerField
              label="Neutral Text"
              value={colors.neutralText}
              onChange={(v) => handleColorChange("neutralText", v)}
            />
            <ColorPickerField label="Danger" value={colors.danger} onChange={(v) => handleColorChange("danger", v)} />
            <ColorPickerField
              label="Danger Hover"
              value={colors.dangerHover}
              onChange={(v) => handleColorChange("dangerHover", v)}
            />
            <ColorPickerField
              label="Danger Text"
              value={colors.dangerText}
              onChange={(v) => handleColorChange("dangerText", v)}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Icon Colors (Optional)
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)"
              }
            }}
          >
            <ColorPickerField
              label="Default Icon"
              value={iconColors.default}
              onChange={(v) => handleIconColorChange("default", v)}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Theme
          </Button>
          <Button variant="outlined" color="inherit" onClick={handleReset}>
            Reset to Default
          </Button>
        </Box>
      </Stack>
    </Panel>
  );
};