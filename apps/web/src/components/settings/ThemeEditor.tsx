import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { CustomTheme, SaveThemeInput } from "@snake/contracts";
import { IconActionButton } from "../shared/IconActionButton";
import { DEFAULT_THEME_DRAFT } from "../../theme/defaultThemeDraft";
import { ColorPickerField } from "./ColorPickerField";
import { FontPicker } from "./FontPicker";
import { approvedIcons } from "../../theme/approvedIcons";

interface ThemeEditorProps {
  theme?: CustomTheme;
  onSave: (input: SaveThemeInput) => void | Promise<void>;
  onCancel?: () => void;
}

export const ThemeEditor = ({ theme, onSave, onCancel }: ThemeEditorProps) => {
  const muiTheme = useTheme();
  const [fontFamily, setFontFamily] = useState(theme?.fontFamily || DEFAULT_THEME_DRAFT.fontFamily);
  const [colors, setColors] = useState<SaveThemeInput["colors"]>(theme?.colors || DEFAULT_THEME_DRAFT.colors);
  const [iconColors, setIconColors] = useState<SaveThemeInput["iconColors"]>({
    ...DEFAULT_THEME_DRAFT.iconColors,
    ...(theme?.iconColors || {})
  });

  const [saving, setSaving] = useState(false);

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

  const sectionGridSx = {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
    gap: 2,
    mb: 3
  } as const;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Theme Customization
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FontPicker value={fontFamily} onChange={setFontFamily} disabled={saving} />
      </Box>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Theme Colors
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        App Surface Colors
      </Typography>
      <Box sx={sectionGridSx}>
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
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        Header & Navigation Colors
      </Typography>
      <Box sx={sectionGridSx}>
        <ColorPickerField
          label="Header Bar Background"
          value={colors.panel}
          onChange={(v) => handleColorChange("panel", v)}
          disabled={saving}
          helperText="Uses the same surface token as cards/panels."
        />
        <ColorPickerField
          label="Header Bar Border"
          value={colors.panelBorder}
          onChange={(v) => handleColorChange("panelBorder", v)}
          disabled={saving}
          helperText="Shared with panel and board borders."
        />
        <ColorPickerField
          label="Header/Profile Text"
          value={colors.text}
          onChange={(v) => handleColorChange("text", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Header Muted Labels"
          value={colors.textMuted}
          onChange={(v) => handleColorChange("textMuted", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Profile Avatar Accent"
          value={colors.action}
          onChange={(v) => handleColorChange("action", v)}
          disabled={saving}
          helperText="Used for avatar fallback background."
        />
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        Board Colors
      </Typography>
      <Box sx={sectionGridSx}>
        <ColorPickerField
          label="Board Background"
          value={colors.boardBg}
          onChange={(v) => handleColorChange("boardBg", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Board Grid"
          value={colors.boardGrid}
          onChange={(v) => handleColorChange("boardGrid", v)}
          disabled={saving}
        />
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        Snake Colors
      </Typography>
      <Box sx={sectionGridSx}>
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
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        Button Colors
      </Typography>
      <Box sx={sectionGridSx}>
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

      <Box sx={sectionGridSx}>
        <ColorPickerField
          label="Default Icon Color"
          value={iconColors.default}
          onChange={(v) => handleIconColorChange("default", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Active Nav Icon"
          value={iconColors.active || iconColors.default}
          onChange={(v) => handleIconColorChange("active", v)}
          disabled={saving}
          helperText="Fallback active color when a tab-specific active color is not set."
        />
        <ColorPickerField
          label="Game Active Icon"
          value={iconColors.gameActive || iconColors.active || iconColors.default}
          onChange={(v) => handleIconColorChange("gameActive", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Stats Active Icon"
          value={iconColors.statsActive || iconColors.active || iconColors.default}
          onChange={(v) => handleIconColorChange("statsActive", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Settings Active Icon"
          value={iconColors.settingsActive || iconColors.active || iconColors.default}
          onChange={(v) => handleIconColorChange("settingsActive", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Game Nav Icon"
          value={iconColors.sportsEsports || iconColors.play || iconColors.default}
          onChange={(v) => handleIconColorChange("sportsEsports", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Stats Nav Icon"
          value={iconColors.barChart || iconColors.stats || iconColors.default}
          onChange={(v) => handleIconColorChange("barChart", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Settings Nav Icon"
          value={iconColors.settings || iconColors.default}
          onChange={(v) => handleIconColorChange("settings", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Pause Icon"
          value={iconColors.pause || iconColors.default}
          onChange={(v) => handleIconColorChange("pause", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Reset Icon"
          value={iconColors.reset || iconColors.default}
          onChange={(v) => handleIconColorChange("reset", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Add Icon"
          value={iconColors.add || iconColors.default}
          onChange={(v) => handleIconColorChange("add", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Edit Icon"
          value={iconColors.edit || iconColors.default}
          onChange={(v) => handleIconColorChange("edit", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Delete Icon"
          value={iconColors.delete || iconColors.default}
          onChange={(v) => handleIconColorChange("delete", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Confirm Icon"
          value={iconColors.check || iconColors.default}
          onChange={(v) => handleIconColorChange("check", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Close Icon"
          value={iconColors.close || iconColors.default}
          onChange={(v) => handleIconColorChange("close", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Switch Icon"
          value={iconColors.swapHoriz || iconColors.default}
          onChange={(v) => handleIconColorChange("swapHoriz", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Warning Icon"
          value={iconColors.warning || iconColors.default}
          onChange={(v) => handleIconColorChange("warning", v)}
          disabled={saving}
        />
        <ColorPickerField
          label="Camera Icon"
          value={iconColors.photoCamera || iconColors.default}
          onChange={(v) => handleIconColorChange("photoCamera", v)}
          disabled={saving}
        />
      </Box>

      <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}>
        {onCancel && (
          <IconActionButton
            tone="neutral"
            variant="text"
            icon={<approvedIcons.close />}
            iconColor={muiTheme.icons.close || muiTheme.icons.default}
            label="Cancel"
            onClick={onCancel}
            disabled={saving}
          />
        )}
        <IconActionButton
          tone="primary"
          variant="contained"
          icon={<approvedIcons.check />}
          iconColor={muiTheme.icons.check || muiTheme.icons.default}
          label={saving ? "Saving..." : "Save Theme"}
          onClick={handleSave}
          disabled={saving}
        />
      </Box>
    </Box>
  );
};
