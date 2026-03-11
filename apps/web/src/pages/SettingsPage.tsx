import { useState } from "react";
import { Typography, Box, Tabs, Tab } from "@mui/material";
import type { CustomTheme, SaveThemeInput } from "@snake/contracts";
import { PageLayout } from "../components/shared/PageLayout";
import { AppButton } from "../components/shared/AppButton";
import { ThemeEditor } from "../components/settings/ThemeEditor";
import { ThemeGallery } from "../components/settings/ThemeGallery";
import { SaveThemeDialog } from "../components/settings/SaveThemeDialog";
import { VariationEditor } from "../components/settings/VariationEditor";
import { useTheme } from "../hooks/useTheme";
import { useProfile } from "../hooks/useProfile";
import { useVariations } from "../hooks/useVariations";

export const SettingsPage = () => {
  const { activeProfile } = useProfile();
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
  
  const {
    variations,
    loading: variationsLoading,
    error: variationsError,
    createVariation,
    updateVariation,
    deleteVariation
  } = useVariations(activeProfile?.id);

  const [activeTab, setActiveTab] = useState(0);
  const [editingVariation, setEditingVariation] = useState<string | null>(null);
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

  if (loading || variationsLoading) {
    return (
      <PageLayout maxWidth="lg" spacing={1}>
        <Typography>Loading...</Typography>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="lg" spacing={4}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Design
        </Typography>
        <Typography variant="body2" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
          Customize game variations and visual themes
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Game Variations" />
          <Tab label="Visual Themes" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Box>
          {variationsError && (
            <Typography variant="body2" sx={{ color: (theme) => theme.ui.settings.errorText, mb: 2 }}>
              {variationsError}
            </Typography>
          )}
          
          <VariationEditor
            initialData={editingVariation ? variations.find(v => v.id === editingVariation) : undefined}
            onSave={async (data) => {
              if (editingVariation) {
                await updateVariation(editingVariation, data);
                setEditingVariation(null);
              } else {
                await createVariation(data);
              }
            }}
            onCancel={editingVariation ? () => setEditingVariation(null) : undefined}
          />

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Saved Variations
            </Typography>
            <Typography variant="body2" sx={{ color: (theme) => theme.ui.leaderboard.mutedText, mb: 2 }}>
              You have {variations.length} variation(s).
            </Typography>
            {variations.map((variation) => (
              <Box
                key={variation.id}
                sx={{
                  p: 2,
                  mb: 2,
                  border: "1px solid",
                  borderColor: (theme) => theme.ui.gameBoard.border,
                  borderRadius: 1
                }}
              >
                <Typography variant="h6">{variation.name}</Typography>
                <Typography variant="body2" sx={{ color: (theme) => theme.ui.leaderboard.mutedText, mb: 1 }}>
                  {variation.description}
                </Typography>
                <Typography variant="caption">
                  Difficulty: {variation.difficulty} | Used: {variation.usageCount} times
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <AppButton onClick={() => setEditingVariation(variation.id)} sx={{ mr: 1 }}>
                    Edit
                  </AppButton>
                  <AppButton onClick={() => deleteVariation(variation.id)}>
                    Delete
                  </AppButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {activeTab === 1 && (
        <>
          {error && (
            <Typography variant="body2" sx={{ color: (theme) => theme.ui.settings.errorText }}>
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
        </>
      )}

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
