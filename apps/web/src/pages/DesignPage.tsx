import { useState } from "react";
import { Typography, Box, Tabs, Tab } from "@mui/material";
import type { CustomTheme, SaveThemeInput } from "@snake/contracts";
import { PageLayout } from "../components/shared/PageLayout";
import { ThemeEditor } from "../components/settings/ThemeEditor";
import { ThemeGallery } from "../components/settings/ThemeGallery";
import { SaveThemeDialog } from "../components/settings/SaveThemeDialog";
import { VariationCard } from "../components/variations/VariationCard";
import { useTheme } from "../hooks/useTheme";
import { useVariation } from "../hooks/useVariation";
import { IconActionButton } from "../components/shared/IconActionButton";
import { approvedIcons } from "../theme/approvedIcons";
import { useTheme as useMuiTheme } from "@mui/material/styles";

export const DesignPage = () => {
  const muiTheme = useMuiTheme();
  const [activeTab, setActiveTab] = useState(0);

  const {
    themes,
    activeTheme,
    loading: themesLoading,
    error: themesError,
    createTheme,
    updateTheme,
    deleteTheme,
    activateTheme
  } = useTheme();

  const {
    variations,
    activeVariation,
    loading: variationsLoading,
    error: variationsError,
    activateVariation,
    deleteVariation
  } = useVariation();

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

  const handleEditTheme = (theme: CustomTheme) => {
    setEditingTheme(theme);
  };

  const handleCancelEditTheme = () => {
    setEditingTheme(null);
  };

  const handleActivateVariation = async (id: string) => {
    try {
      await activateVariation(id);
    } catch (error) {
      console.error("Failed to activate variation:", error);
    }
  };

  const handleDeleteVariation = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this variation?")) {
      try {
        await deleteVariation(id);
      } catch (error) {
        console.error("Failed to delete variation:", error);
      }
    }
  };

  if (themesLoading || variationsLoading) {
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
        <Typography variant="body2" sx={{ color: muiTheme.ui.leaderboard.mutedText }}>
          Customize game variations and themes
        </Typography>
      </Box>

      <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
        <Tab label="Game Variations" />
        <Tab label="Themes" />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5">Your Variations</Typography>
            <IconActionButton
              tone="primary"
              variant="contained"
              icon={<approvedIcons.add />}
              iconColor={muiTheme.icons.add || muiTheme.icons.default}
              label="Create Variation"
              onClick={() => {
                // TODO: Open variation editor dialog
                console.log("Create variation");
              }}
            />
          </Box>

          {variationsError && (
            <Typography variant="body2" sx={{ color: muiTheme.ui.settings.errorText, mb: 2 }}>
              {variationsError}
            </Typography>
          )}

          {variations.length === 0 ? (
            <Typography variant="body2" sx={{ color: muiTheme.ui.leaderboard.mutedText }}>
              No variations yet. Create your first custom game variation!
            </Typography>
          ) : (
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2 }}>
              {variations.map((variation) => (
                <VariationCard
                  key={variation.id}
                  variation={variation}
                  isActive={activeVariation?.id === variation.id}
                  onActivate={handleActivateVariation}
                  onEdit={(v) => {
                    // TODO: Open variation editor with this variation
                    console.log("Edit variation", v);
                  }}
                  onDelete={handleDeleteVariation}
                />
              ))}
            </Box>
          )}
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          {themesError && (
            <Typography variant="body2" sx={{ color: muiTheme.ui.settings.errorText }}>
              {themesError}
            </Typography>
          )}

          <Box sx={{ mb: 4 }}>
            <ThemeEditor
              theme={editingTheme || undefined}
              onSave={handleSaveFromEditor}
              onCancel={editingTheme ? handleCancelEditTheme : undefined}
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
              onEdit={handleEditTheme}
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
        </Box>
      )}
    </PageLayout>
  );
};