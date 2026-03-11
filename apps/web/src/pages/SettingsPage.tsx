import { useState } from "react";
import { Typography, Box, Tabs, Tab } from "@mui/material";
import type { CustomTheme, SaveThemeInput, GameVariation } from "@snake/contracts";
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
  const [editingVariationId, setEditingVariationId] = useState<string | null>(null);
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

  const editingVariation: GameVariation | undefined =
    editingVariationId ? variations.find((variation) => variation.id === editingVariationId) : undefined;

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

      <Box sx={{ borderBottom: 1, borderColor: (theme) => theme.ui.stats.tabsBorder }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Game Variations" />
          <Tab label="Visual Themes" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Box sx={{ display: "grid", gap: 3 }}>
          {variationsError && (
            <Typography variant="body2" sx={{ color: (theme) => theme.ui.settings.errorText }}>
              {variationsError}
            </Typography>
          )}
          <VariationEditor
            variation={editingVariation}
            onSave={async (data) => {
              if (editingVariationId) {
                await updateVariation(editingVariationId, data);
                setEditingVariationId(null);
                return;
              }
              await createVariation(data);
            }}
            onCancel={editingVariationId ? () => setEditingVariationId(null) : undefined}
          />
          <Box>
            <Typography variant="h5" gutterBottom>
              Saved Variations
            </Typography>
            {variations.length === 0 ? (
              <Typography variant="body2" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
                No saved variations yet.
              </Typography>
            ) : (
              <Box sx={{ display: "grid", gap: 2 }}>
                {variations.map((variation) => (
                  <Box
                    key={variation.id}
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: (theme) => theme.ui.shared.panelBorder,
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="h6">{variation.name}</Typography>
                    {variation.description ? (
                      <Typography variant="body2" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
                        {variation.description}
                      </Typography>
                    ) : null}
                    <Typography variant="caption" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
                      Difficulty: {variation.difficulty ?? "medium"} | Base speed: {variation.baseSpeed} | Grid:{" "}
                      {variation.gridSize}
                    </Typography>
                    <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                      <AppButton size="small" onClick={() => setEditingVariationId(variation.id)}>
                        Edit
                      </AppButton>
                      <AppButton size="small" tone="danger" onClick={() => deleteVariation(variation.id)}>
                        Delete
                      </AppButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
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
