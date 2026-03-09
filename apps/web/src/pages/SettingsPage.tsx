import { useMemo, useState } from "react";
import { Alert, Container, Stack, Typography } from "@mui/material";
import { ThemeEditor } from "../components/settings/ThemeEditor";
import { ThemeGallery } from "../components/settings/ThemeGallery";
import { SaveThemeDialog } from "../components/settings/SaveThemeDialog";
import { useTheme } from "../hooks/useTheme";
import { apiThemeService } from "../services/adapters/apiThemeService";
import type { ThemeService } from "../services/themeService";
import { localThemeService } from "../services/storage/localThemeService";
import type { ThemeColors, ThemeIconColors } from "@snake/contracts";
import { gameTokens } from "../theme/tokens";

const resolveService = (): ThemeService => {
  const mode = import.meta.env.VITE_GAME_SERVICE_MODE;
  return mode === "local" ? localThemeService : apiThemeService;
};

const defaultIconColors: ThemeIconColors = {
  default: gameTokens.colors.text
};

export const SettingsPage = () => {
  const service = useMemo(resolveService, []);
  const { themes, activeTheme, loading, error, createTheme, updateTheme, deleteTheme, activateTheme } =
    useTheme(service);

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [pendingTheme, setPendingTheme] = useState<{
    colors: ThemeColors;
    iconColors: ThemeIconColors;
    fontFamily: string;
  } | null>(null);

  const handleSave = (colors: ThemeColors, iconColors: ThemeIconColors, fontFamily: string) => {
    setPendingTheme({ colors, iconColors, fontFamily });
    setSaveDialogOpen(true);
  };

  const handleSaveConfirm = async (name: string) => {
    if (!pendingTheme) return;

    try {
      await createTheme({
        name,
        colors: pendingTheme.colors,
        iconColors: pendingTheme.iconColors,
        fontFamily: pendingTheme.fontFamily
      });
      setSaveDialogOpen(false);
      setPendingTheme(null);
    } catch (err) {
      console.error("Failed to save theme:", err);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await activateTheme(id);
      // Theme will be auto-applied by CustomThemeProvider on next render
      window.location.reload(); // Force reload to apply theme
    } catch (err) {
      console.error("Failed to activate theme:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this theme?")) {
      try {
        await deleteTheme(id);
      } catch (err) {
        console.error("Failed to delete theme:", err);
      }
    }
  };

  const handleEdit = (id: string) => {
    // For now, just show an alert - full edit functionality can be added later
    alert("Edit functionality coming soon!");
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading themes...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Typography variant="h4" gutterBottom>
          Theme Settings
        </Typography>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <ThemeEditor
          initialColors={activeTheme?.colors}
          initialIconColors={activeTheme?.iconColors}
          initialFontFamily={activeTheme?.fontFamily}
          onSave={handleSave}
          onReset={() => {
            // Reset handled by ThemeEditor internally
          }}
        />

        <ThemeGallery
          themes={themes}
          activeThemeId={activeTheme?.id ?? null}
          onActivate={handleActivate}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <SaveThemeDialog
          open={saveDialogOpen}
          onSave={handleSaveConfirm}
          onCancel={() => {
            setSaveDialogOpen(false);
            setPendingTheme(null);
          }}
        />
      </Stack>
    </Container>
  );
};
