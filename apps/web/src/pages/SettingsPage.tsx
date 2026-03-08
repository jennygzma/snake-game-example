import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { ColorPickerField } from "../components/settings/ColorPickerField";
import { FontPicker } from "../components/settings/FontPicker";
import { ThemeGallery } from "../components/settings/ThemeGallery";
import { Panel } from "../components/shared/Panel";
import { apiThemeService } from "../services/adapters/apiThemeService";
import { localThemeService } from "../services/storage/localThemeService";
import type { ThemeService } from "../services/themeService";
import type { SaveThemeInput, ThemeColors, ThemeIconColors } from "@snake/contracts";
import { gameTokens } from "../theme/tokens";
import { useThemeContext } from "../contexts/ThemeContext";

const resolveService = (): ThemeService => {
  const mode = import.meta.env.VITE_GAME_SERVICE_MODE;
  return mode === "local" ? localThemeService : apiThemeService;
};

export const SettingsPage = () => {
  const service = useMemo(resolveService, []);
  const { refreshTheme } = useThemeContext();
  const [galleryKey, setGalleryKey] = useState(0);
  const [themeName, setThemeName] = useState("My Custom Theme");
  const [fontFamily, setFontFamily] = useState("'Space Grotesk', 'Avenir Next', 'Segoe UI', sans-serif");
  const [colors, setColors] = useState<ThemeColors>({ ...gameTokens.colors });
  const [iconColors, setIconColors] = useState<ThemeIconColors>({
    default: gameTokens.colors.action
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setFontFamily("'Space Grotesk', 'Avenir Next', 'Segoe UI', sans-serif");
  }, []);

  const updateColor = (key: keyof ThemeColors, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const updateIconColor = (key: keyof ThemeIconColors, value: string) => {
    setIconColors((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const input: SaveThemeInput = {
        name: themeName,
        fontFamily,
        colors,
        iconColors
      };

      await service.createTheme(input);
      setGalleryKey((prev) => prev + 1); // Force gallery refresh
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save theme");
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = () => {
    refreshTheme();
    setGalleryKey((prev) => prev + 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Theme Customization
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Theme saved successfully!</Alert>}

        <Panel>
          <Stack spacing={3}>
            <TextField
              label="Theme Name"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              fullWidth
            />

            <FontPicker value={fontFamily} onChange={setFontFamily} />

            <Divider />

            <Typography variant="h6">Background Colors</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ flex: "1 1 300px", minWidth: 250 }}>
                <ColorPickerField
                  label="Main Background"
                  value={colors.bg}
                  onChange={(v) => updateColor("bg", v)}
                  description="Overall page background"
                />
              </Box>
              <Box sx={{ flex: "1 1 300px", minWidth: 250 }}>
                <ColorPickerField
                  label="Panel Background"
                  value={colors.panel}
                  onChange={(v) => updateColor("panel", v)}
                  description="Panel/card backgrounds"
                />
              </Box>
              <Box sx={{ flex: "1 1 300px", minWidth: 250 }}>
                <ColorPickerField
                  label="Panel Border"
                  value={colors.panelBorder}
                  onChange={(v) => updateColor("panelBorder", v)}
                />
              </Box>
              <Box sx={{ flex: "1 1 300px", minWidth: 250 }}>
                <ColorPickerField
                  label="Board Background"
                  value={colors.boardBg}
                  onChange={(v) => updateColor("boardBg", v)}
                />
              </Box>
              <Box sx={{ flex: "1 1 300px", minWidth: 250 }}>
                <ColorPickerField
                  label="Board Grid"
                  value={colors.boardGrid}
                  onChange={(v) => updateColor("boardGrid", v)}
                />
              </Box>
            </Box>

            <Divider />

            <Typography variant="h6">Text Colors</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ flex: "1 1 300px", minWidth: 250 }}>
                <ColorPickerField
                  label="Primary Text"
                  value={colors.text}
                  onChange={(v) => updateColor("text", v)}
                />
              </Box>
              <Box sx={{ flex: "1 1 300px", minWidth: 250 }}>
                <ColorPickerField
                  label="Muted Text"
                  value={colors.textMuted}
                  onChange={(v) => updateColor("textMuted", v)}
                />
              </Box>
            </Box>

            <Divider />

            <Typography variant="h6">Game Elements</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ flex: "1 1 300px", minWidth: 250 }}>
                <ColorPickerField
                  label="Snake Body"
                  value={colors.snake}
                  onChange={(v) => updateColor("snake", v)}
                />
              </Box>
              <Box sx={{ flex: "1 1 300px", minWidth: 250 }}>
                <ColorPickerField
                  label="Snake Head"
                  value={colors.snakeHead}
                  onChange={(v) => updateColor("snakeHead", v)}
                />
              </Box>
              <Box sx={{ flex: "1 1 300px", minWidth: 250 }}>
                <ColorPickerField
                  label="Food"
                  value={colors.food}
                  onChange={(v) => updateColor("food", v)}
                />
              </Box>
            </Box>

            <Divider />

            <Typography variant="h6">Button Colors</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ flex: "1 1 250px", minWidth: 200 }}>
                <ColorPickerField
                  label="Action Button"
                  value={colors.action}
                  onChange={(v) => updateColor("action", v)}
                />
              </Box>
              <Box sx={{ flex: "1 1 250px", minWidth: 200 }}>
                <ColorPickerField
                  label="Action Hover"
                  value={colors.actionHover}
                  onChange={(v) => updateColor("actionHover", v)}
                />
              </Box>
              <Box sx={{ flex: "1 1 250px", minWidth: 200 }}>
                <ColorPickerField
                  label="Action Text"
                  value={colors.actionText}
                  onChange={(v) => updateColor("actionText", v)}
                />
              </Box>
              <Box sx={{ flex: "1 1 250px", minWidth: 200 }}>
                <ColorPickerField
                  label="Pause Button"
                  value={colors.pause}
                  onChange={(v) => updateColor("pause", v)}
                />
              </Box>
              <Box sx={{ flex: "1 1 250px", minWidth: 200 }}>
                <ColorPickerField
                  label="Pause Hover"
                  value={colors.pauseHover}
                  onChange={(v) => updateColor("pauseHover", v)}
                />
              </Box>
              <Box sx={{ flex: "1 1 250px", minWidth: 200 }}>
                <ColorPickerField
                  label="Pause Text"
                  value={colors.pauseText}
                  onChange={(v) => updateColor("pauseText", v)}
                />
              </Box>
              <Box sx={{ flex: "1 1 250px", minWidth: 200 }}>
                <ColorPickerField
                  label="Neutral Button"
                  value={colors.neutral}
                  onChange={(v) => updateColor("neutral", v)}
                />
              </Box>
              <Box sx={{ flex: "1 1 250px", minWidth: 200 }}>
                <ColorPickerField
                  label="Neutral Hover"
                  value={colors.neutralHover}
                  onChange={(v) => updateColor("neutralHover", v)}
                />
              </Box>
              <Box sx={{ flex: "1 1 250px", minWidth: 200 }}>
                <ColorPickerField
                  label="Neutral Text"
                  value={colors.neutralText}
                  onChange={(v) => updateColor("neutralText", v)}
                />
              </Box>
              <Box sx={{ flex: "1 1 250px", minWidth: 200 }}>
                <ColorPickerField
                  label="Danger Button"
                  value={colors.danger}
                  onChange={(v) => updateColor("danger", v)}
                />
              </Box>
              <Box sx={{ flex: "1 1 250px", minWidth: 200 }}>
                <ColorPickerField
                  label="Danger Hover"
                  value={colors.dangerHover}
                  onChange={(v) => updateColor("dangerHover", v)}
                />
              </Box>
              <Box sx={{ flex: "1 1 250px", minWidth: 200 }}>
                <ColorPickerField
                  label="Danger Text"
                  value={colors.dangerText}
                  onChange={(v) => updateColor("dangerText", v)}
                />
              </Box>
            </Box>

            <Divider />

            <Typography variant="h6">Icon Colors</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ flex: "1 1 300px", minWidth: 250 }}>
                <ColorPickerField
                  label="Default Icon Color"
                  value={iconColors.default}
                  onChange={(v) => updateIconColor("default", v)}
                  description="Applied to all icons by default"
                />
              </Box>
              <Box sx={{ flex: "1 1 300px", minWidth: 250 }}>
                <ColorPickerField
                  label="Play Icon (Optional)"
                  value={iconColors.play || iconColors.default}
                  onChange={(v) => updateIconColor("play", v)}
                />
              </Box>
              <Box sx={{ flex: "1 1 300px", minWidth: 250 }}>
                <ColorPickerField
                  label="Pause Icon (Optional)"
                  value={iconColors.pause || iconColors.default}
                  onChange={(v) => updateIconColor("pause", v)}
                />
              </Box>
              <Box sx={{ flex: "1 1 300px", minWidth: 250 }}>
                <ColorPickerField
                  label="Replay Icon (Optional)"
                  value={iconColors.replay || iconColors.default}
                  onChange={(v) => updateIconColor("replay", v)}
                />
              </Box>
              <Box sx={{ flex: "1 1 300px", minWidth: 250 }}>
                <ColorPickerField
                  label="Settings Icon (Optional)"
                  value={iconColors.settings || iconColors.default}
                  onChange={(v) => updateIconColor("settings", v)}
                />
              </Box>
              <Box sx={{ flex: "1 1 300px", minWidth: 250 }}>
                <ColorPickerField
                  label="Stats Icon (Optional)"
                  value={iconColors.stats || iconColors.default}
                  onChange={(v) => updateIconColor("stats", v)}
                />
              </Box>
            </Box>

            <Box sx={{ pt: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSave}
                disabled={saving || !themeName.trim()}
              >
                {saving ? "Saving..." : "Save Theme"}
              </Button>
            </Box>
          </Stack>
        </Panel>

        <Box>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Saved Themes
          </Typography>
          <ThemeGallery key={galleryKey} service={service} onThemeChange={handleThemeChange} />
        </Box>
      </Stack>
    </Container>
  );
};
