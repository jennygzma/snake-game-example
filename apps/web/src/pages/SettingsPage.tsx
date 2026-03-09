import { Alert, Box, Button, Container, Divider, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import type { CustomTheme } from "@snake/contracts";
import { Panel } from "../components/shared/Panel";
import { SaveThemeDialog } from "../components/settings/SaveThemeDialog";
import { ThemeEditor } from "../components/settings/ThemeEditor";
import { ThemeGallery } from "../components/settings/ThemeGallery";
import { useTheme } from "../hooks/useTheme";
import { apiThemeService } from "../services/adapters/apiThemeService";
import type { ThemeService } from "../services/themeService";
import { localThemeService } from "../services/storage/localThemeService";

const resolveService = (): ThemeService => {
  const mode = import.meta.env.VITE_GAME_SERVICE_MODE;
  return mode === "local" ? localThemeService : apiThemeService;
};

export const SettingsPage = () => {
  const service = useMemo(resolveService, []);
  const {
    themes,
    activeTheme,
    loading,
    error,
    createTheme,
    updateTheme,
    deleteTheme,
    activateTheme
  } = useTheme(service);

  const [showEditor, setShowEditor] = useState(false);
  const [editingTheme, setEditingTheme] = useState<CustomTheme | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [pendingThemeData, setPendingThemeData] = useState<any>(null);

  const handleCreateNew = () => {
    setEditingTheme(null);
    setShowEditor(true);
  };

  const handleEdit = (theme: CustomTheme) => {
    setEditingTheme(theme);
    setShowEditor(true);
  };

  const handleSaveThemeData = (data: any) => {
    setPendingThemeData(data);
    setShowSaveDialog(true);
  };

  const handleSaveWithName = async (name: string) => {
    if (!pendingThemeData) return;

    try {
      if (editingTheme) {
        await updateTheme(editingTheme.id, {
          name,
          ...pendingThemeData
        });
      } else {
        await createTheme({
          name,
          ...pendingThemeData
        });
      }
      setShowSaveDialog(false);
      setShowEditor(false);
      setPendingThemeData(null);
      setEditingTheme(null);
    } catch (err) {
      console.error("Failed to save theme:", err);
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

  const handleActivate = async (id: string) => {
    try {
      await activateTheme(id);
    } catch (err) {
      console.error("Failed to activate theme:", err);
    }
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
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Theme Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Customize the appearance of the snake game
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {!showEditor ? (
          <Panel>
            <Stack spacing={3}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h5">Your Themes</Typography>
                <Button variant="contained" onClick={handleCreateNew}>
                  Create New Theme
                </Button>
              </Box>

              <Divider />

              <ThemeGallery
                themes={themes}
                activeThemeId={activeTheme?.id}
                onActivate={handleActivate}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Stack>
          </Panel>
        ) : (
          <Panel>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h5">
                  {editingTheme ? `Edit: ${editingTheme.name}` : "Create New Theme"}
                </Typography>
                <Button onClick={() => setShowEditor(false)}>Back to Gallery</Button>
              </Box>

              <Divider />

              <ThemeEditor
                initialColors={editingTheme?.colors}
                initialIconColors={editingTheme?.iconColors}
                initialFontFamily={editingTheme?.fontFamily}
                onSave={handleSaveThemeData}
                onCancel={() => setShowEditor(false)}
              />
            </Stack>
          </Panel>
        )}

        <SaveThemeDialog
          open={showSaveDialog}
          defaultName={editingTheme?.name ?? ""}
          onClose={() => setShowSaveDialog(false)}
          onSave={handleSaveWithName}
        />
      </Stack>
    </Container>
  );
};
