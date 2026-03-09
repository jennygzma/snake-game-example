import { useState } from "react";
import { Typography, Box } from "@mui/material";
import type { CustomTheme, SaveThemeInput } from "@snake/contracts";
import { PageLayout } from "../components/shared/PageLayout";
import { ThemeEditor } from "../components/settings/ThemeEditor";
import { ThemeGallery } from "../components/settings/ThemeGallery";
import { SaveThemeDialog } from "../components/settings/SaveThemeDialog";
import { useTheme } from "../hooks/useTheme";

export const SettingsPage = () => {
  const {
    themes,
    activeTheme,
    loading,
    error,
    createTheme,
    updateTheme,
    deleteTheme,
    activateTheme
  } = useTheme();

  const [editingTheme, setEditingTheme] = useState<CustomTheme | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [pendingThemeData, setPendingThemeData] = useState<SaveThemeInput | null>(null);

  const handleSaveFromEditor = async (themeData: SaveThemeInput) => {
    setPendingThemeData(themeData);
    setSaveDialogOpen(true);
  };

  const handleSaveTheme = async (name: string) => {
    if (!pendingThemeData) return;

    if (editingTheme) {
      await updateTheme(editingTheme.id, { ...pendingThemeData, name });
    } else {
      await createTheme({ ...pendingThemeData, name });
    }

    setPendingThemeData(null);
    setEditingTheme(null);
  };

  const handleEdit = (theme: CustomTheme) => {
    setEditingTheme(theme);
  };

  const handleCancelEdit = () => {
    setEditingTheme(null);
  };

  if (loading) {
    return (
      <PageLayout maxWidth="lg" spacing={1}>
        <Typography>Loading themes...</Typography>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="lg" spacing={4}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Customize your game theme and colors
        </Typography>
      </Box>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <Box>
        <ThemeEditor
          theme={editingTheme || undefined}
          onSave={handleSaveFromEditor}
          onCancel={editingTheme ? handleCancelEdit : undefined}
        />
      </Box>

      <Box>
        <Typography variant="h5" gutterBottom>
          Saved Themes
        </Typography>
        <ThemeGallery
          themes={themes}
          activeThemeId={activeTheme?.id}
          onActivate={async (id) => {
            await activateTheme(id);
          }}
          onEdit={handleEdit}
          onDelete={async (id) => {
            await deleteTheme(id);
          }}
        />
      </Box>

      <SaveThemeDialog
        open={saveDialogOpen}
        initialName={editingTheme?.name || ""}
        onClose={() => {
          setSaveDialogOpen(false);
          setPendingThemeData(null);
        }}
        onSave={handleSaveTheme}
      />
    </PageLayout>
  );
};
