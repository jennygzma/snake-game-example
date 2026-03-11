import { useEffect, useMemo, useState } from "react";
import { Box, Card, CardActions, CardContent, Chip, Tab, Tabs, Typography } from "@mui/material";
import type { CustomTheme, GameVariation, SaveThemeInput } from "@snake/contracts";
import { PageLayout } from "../components/shared/PageLayout";
import { IconActionButton } from "../components/shared/IconActionButton";
import { SaveThemeDialog } from "../components/settings/SaveThemeDialog";
import { ShareDialog } from "../components/settings/ShareDialog";
import { ThemeEditor } from "../components/settings/ThemeEditor";
import { ThemeGallery } from "../components/settings/ThemeGallery";
import { VariationEditor } from "../components/settings/VariationEditor";
import { useProfile } from "../hooks/useProfile";
import { useTheme } from "../hooks/useTheme";
import { useVariations } from "../hooks/useVariations";
import { approvedIcons } from "../theme/approvedIcons";
import { apiGameService } from "../services/adapters/apiGameService";
import type { GameService } from "../services/gameService";
import { localGameService } from "../services/storage/localGameService";
import { apiHubService } from "../services/adapters/apiHubService";
import { localHubService } from "../services/storage/localHubService";
import type { HubService } from "../services/hubService";

const resolveGameService = (): GameService => {
  const mode = import.meta.env.VITE_GAME_SERVICE_MODE;
  return mode === "local" ? localGameService : apiGameService;
};

const resolveHubService = (): HubService => {
  const mode = import.meta.env.VITE_GAME_SERVICE_MODE;
  return mode === "local" ? localHubService : apiHubService;
};

export const SettingsPage = () => {
  const gameService = useMemo(resolveGameService, []);
  const hubService = useMemo(resolveHubService, []);
  const { activeProfile } = useProfile();
  const { themes, activeTheme, loading, error, createTheme, updateTheme, deleteTheme, activateTheme } = useTheme();
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
  const [activeVariationId, setActiveVariationId] = useState<string | null>(null);
  const [editingTheme, setEditingTheme] = useState<CustomTheme | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [pendingThemeData, setPendingThemeData] = useState<SaveThemeInput | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [sharingItem, setSharingItem] = useState<{ id: string; name: string; type: "theme" | "variation" } | null>(null);

  const editingVariation: GameVariation | undefined =
    editingVariationId ? variations.find((variation) => variation.id === editingVariationId) : undefined;

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const gameSettings = await gameService.getSettings();
        setActiveVariationId(gameSettings.variationId ?? null);
      } catch {
        setActiveVariationId(null);
      }
    };

    void loadSettings();
  }, [activeProfile?.id, gameService]);

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

  const handleActivateVariation = async (variationId: string | null) => {
    const settings = await gameService.getSettings();
    await gameService.saveSettings({
      speed: settings.speed,
      gridSize: settings.gridSize,
      variationId: variationId ?? undefined
    });
    setActiveVariationId(variationId);
  };

  const handleDeleteVariation = async (variationId: string) => {
    await deleteVariation(variationId);
    if (activeVariationId === variationId) {
      await handleActivateVariation(null);
    }
  };

  const handleShareItem = async (description?: string) => {
    if (!sharingItem) return;

    try {
      if (sharingItem.type === "theme") {
        await hubService.shareTheme({ themeId: sharingItem.id, description });
      } else {
        await hubService.shareVariation({ variationId: sharingItem.id, description });
      }
      setShareDialogOpen(false);
      setSharingItem(null);
    } catch (error) {
      console.error("Failed to share:", error);
    }
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
            initialData={editingVariation}
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
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                  gap: 2
                }}
              >
                {variations.map((variation) => {
                  const isActive = activeVariationId === variation.id;
                  return (
                    <Card
                      key={variation.id}
                      sx={{
                        position: "relative",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          boxShadow: 4,
                          transform: "translateY(-2px)"
                        }
                      }}
                    >
                      {isActive && (
                        <Chip
                          label="Active"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 1
                          }}
                        />
                      )}

                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {variation.name}
                        </Typography>
                        {variation.description ? (
                          <Typography variant="body2" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
                            {variation.description}
                          </Typography>
                        ) : null}
                        <Typography variant="body2" sx={{ color: (theme) => theme.ui.leaderboard.mutedText, mt: 1 }}>
                          Difficulty: {variation.difficulty ?? "medium"} | Speed: {variation.baseSpeed}
                        </Typography>
                        <Typography variant="body2" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
                          Grid: {variation.gridSize} | Foods: {variation.maxConcurrentFoods}
                        </Typography>
                        <Box sx={{ mt: 1, display: "flex", gap: 0.5 }}>
                          {variation.powerupTypes.slice(0, 5).map((powerup, index) => (
                            <Box
                              key={`${variation.id}-swatch-${index}`}
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: 0.5,
                                border: "1px solid",
                                borderColor: (theme) => theme.ui.shared.panelBorder,
                                bgcolor: powerup.color
                              }}
                              title={`${powerup.effect} (${powerup.value})`}
                            />
                          ))}
                        </Box>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2, pt: 0 }}>
                        <IconActionButton
                          size="small"
                          variant="outlined"
                          tone="neutral"
                          icon={<approvedIcons.share />}
                          label={`Share ${variation.name} to Hub`}
                          iconOnly
                          onClick={() => {
                            setSharingItem({ id: variation.id, name: variation.name, type: "variation" });
                            setShareDialogOpen(true);
                          }}
                        />
                        <IconActionButton
                          size="small"
                          variant="outlined"
                          tone="neutral"
                          icon={<approvedIcons.edit />}
                          label={`Edit ${variation.name}`}
                          iconOnly
                          onClick={() => setEditingVariationId(variation.id)}
                        />
                        <IconActionButton
                          size="small"
                          variant="contained"
                          tone="primary"
                          icon={<approvedIcons.check />}
                          label={isActive ? `${variation.name} is active` : `Activate ${variation.name}`}
                          iconOnly
                          disabled={isActive}
                          onClick={() => void handleActivateVariation(variation.id)}
                        />
                        <IconActionButton
                          size="small"
                          variant="text"
                          tone="danger"
                          icon={<approvedIcons.delete />}
                          label={`Delete ${variation.name}`}
                          iconOnly
                          onClick={() => void handleDeleteVariation(variation.id)}
                        />
                      </CardActions>
                    </Card>
                  );
                })}
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
              onCancel={editingTheme ? () => setEditingTheme(null) : undefined}
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
              onEdit={setEditingTheme}
              onDelete={async (id) => {
                await deleteTheme(id);
              }}
              onShare={(themeId, themeName) => {
                setSharingItem({ id: themeId, name: themeName, type: "theme" });
                setShareDialogOpen(true);
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

      <ShareDialog
        open={shareDialogOpen}
        itemName={sharingItem?.name || ""}
        itemType={sharingItem?.type || "theme"}
        onClose={() => {
          setShareDialogOpen(false);
          setSharingItem(null);
        }}
        onShare={handleShareItem}
      />
    </PageLayout>
  );
};
