import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import type { CustomTheme, SaveThemeInput } from "@snake/contracts";
import { ColorPickerField } from "./ColorPickerField";
import { FontPicker } from "./FontPicker";

interface ThemeEditorProps {
  theme?: CustomTheme;
  onSave: (input: SaveThemeInput) => void | Promise<void>;
  onCancel?: () => void;
}

export const ThemeEditor = ({ theme, onSave, onCancel }: ThemeEditorProps) => {
  const getDefaultColors = () => ({
    bg: "#1a1a1a",
    panel: "#2a2a2a",
    panelBorder: "#3a3a3a",
    text: "#ffffff",
    textMuted: "#999999",
    snake: "#87ae73",
    snakeHead: "#6b8a5c",
    food: "#9a4e4e",
    boardGrid: "rgba(255,255,255,0.05)",
    boardBg: "#0a0a0a",
    action: "#87ae73",
    actionHover: "#6b8a5c",
    actionText: "#ffffff",
    pause: "#FDB813",
    pauseHover: "#e5a511",
    pauseText: "#000000",
    neutral: "#9e9e9e",
    neutralHover: "#808080",
    neutralText: "#ffffff",
    danger: "#9a4e4e",
    dangerHover: "#7a3e3e",
    dangerText: "#ffffff"
  });

  const [fontFamily, setFontFamily] = useState(theme?.fontFamily || "Arial");
  const [colors, setColors] = useState(theme?.colors || getDefaultColors());
  const [iconColors, setIconColors] = useState(theme?.iconColors || { default: "#ffffff" });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFontFamily(theme?.fontFamily || "Arial");
    setColors(theme?.colors || getDefaultColors());
    setIconColors(theme?.iconColors || { default: "#ffffff" });
  }, [theme]);

  const handleColorChange = (colorKey: keyof typeof colors, value: string) => {
    setColors((prev) => ({ ...prev, [colorKey]: value }));
  };

  const handleIconColorChange = (key: keyof typeof iconColors, value: string) => {
    setIconColors((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const themeName = theme?.name || "Custom Theme";
      await onSave({
        name: themeName,
        fontFamily,
        colors,
        iconColors
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Theme Customization
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FontPicker value={fontFamily} onChange={setFontFamily} disabled={saving} />
      </Box>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Game Colors
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 2,
          mb: 3
        }}
      >
        <ColorPickerField
          label="Background"
          value={colors.bg}
          onChange={(v) => handleColorChange("bg", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Panel"
          value={colors.panel}
          onChange={(v) => handleColorChange("panel", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Panel Border"
          value={colors.panelBorder}
          onChange={(v) => handleColorChange("panelBorder", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Text"
          value={colors.text}
          onChange={(v) => handleColorChange("text", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Text Muted"
          value={colors.textMuted}
          onChange={(v) => handleColorChange("textMuted", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Snake"
          value={colors.snake}
          onChange={(v) => handleColorChange("snake", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Snake Head"
          value={colors.snakeHead}
          onChange={(v) => handleColorChange("snakeHead", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Food"
          value={colors.food}
          onChange={(v) => handleColorChange("food", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Action Button"
          value={colors.action}
          onChange={(v) => handleColorChange("action", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Action Hover"
          value={colors.actionHover}
          onChange={(v) => handleColorChange("actionHover", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Action Text"
          value={colors.actionText}
          onChange={(v) => handleColorChange("actionText", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Pause Button"
          value={colors.pause}
          onChange={(v) => handleColorChange("pause", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Pause Hover"
          value={colors.pauseHover}
          onChange={(v) => handleColorChange("pauseHover", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Pause Text"
          value={colors.pauseText}
          onChange={(v) => handleColorChange("pauseText", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Neutral Button"
          value={colors.neutral}
          onChange={(v) => handleColorChange("neutral", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Neutral Hover"
          value={colors.neutralHover}
          onChange={(v) => handleColorChange("neutralHover", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Neutral Text"
          value={colors.neutralText}
          onChange={(v) => handleColorChange("neutralText", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Danger Button"
          value={colors.danger}
          onChange={(v) => handleColorChange("danger", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Danger Hover"
          value={colors.dangerHover}
          onChange={(v) => handleColorChange("dangerHover", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Danger Text"
          value={colors.dangerText}
          onChange={(v) => handleColorChange("dangerText", v)}
          disabled={saving}
        />
      </Box>

      <Typography variant="h6" gutterBottom>
        Icon Colors
      </Typography>

      <Box sx={{ mb: 3 }}>
        <ColorPickerField
          label="Default Icon Color"
          value={iconColors.default}
          onChange={(v) => handleIconColorChange("default", v)}
          disabled={saving}
        />
      </Box>

      <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}>
        {onCancel && (
          <Button onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        )}
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Theme"}
        </Button>
      </Box>
    </Box>
  );
};
