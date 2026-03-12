import { useState } from "react";
import { Box, Tab, Tabs, Typography, CircularProgress } from "@mui/material";
import { PageLayout } from "../components/shared/PageLayout";
import { HubThemeCard } from "../components/hub/HubThemeCard";
import { HubVariationCard } from "../components/hub/HubVariationCard";
import { HubFilters } from "../components/hub/HubFilters";
import { HubPagination } from "../components/hub/HubPagination";
import type { HubSortBy, HubThemeWithCreator, HubVariationWithCreator } from "@snake/contracts";
import { useHub } from "../hooks/useHub";

export const HubPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const themesHub = useHub("themes");
  const variationsHub = useHub("variations");
  const currentHub = activeTab === 0 ? themesHub : variationsHub;

  const handleFavoriteTheme = async (id: string) => {
    const item = themesHub.items.find((hubItem) => hubItem.id === id) as HubThemeWithCreator | undefined;
    if (!item) return;
    if (item.isFavorited) {
      await themesHub.unfavorite(id);
    } else {
      await themesHub.favorite(id);
    }
  };

  const handleCopyTheme = async (id: string) => {
    await themesHub.copy(id);
    await themesHub.refetch();
  };

  const handleFavoriteVariation = async (id: string) => {
    const item = variationsHub.items.find((hubItem) => hubItem.id === id) as HubVariationWithCreator | undefined;
    if (!item) return;
    if (item.isFavorited) {
      await variationsHub.unfavorite(id);
    } else {
      await variationsHub.favorite(id);
    }
  };

  const handleCopyVariation = async (id: string) => {
    await variationsHub.copy(id);
    await variationsHub.refetch();
  };

  const themes = themesHub.items as HubThemeWithCreator[];
  const variations = variationsHub.items as HubVariationWithCreator[];
  const loading = currentHub.loading;
  const error = currentHub.error;

  return (
    <PageLayout maxWidth="lg" spacing={4}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Hub
        </Typography>
        <Typography variant="body2" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
          Discover and share themes and game variations
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: (theme) => theme.ui.stats.tabsBorder }}>
        <Tabs value={activeTab} onChange={(_, newValue) => {
          setActiveTab(newValue);
        }}>
          <Tab label="Themes" />
          <Tab label="Variations" />
        </Tabs>
      </Box>

      <HubFilters
        searchQuery={currentHub.filters.query ?? ""}
        difficulty={currentHub.filters.difficulty}
        sortBy={(currentHub.filters.sortBy ?? "recent") as HubSortBy}
        showDifficulty={activeTab === 1}
        onSearchChange={(query) => currentHub.updateFilters({ query: query || undefined })}
        onDifficultyChange={(nextDifficulty) => currentHub.updateFilters({ difficulty: nextDifficulty })}
        onSortChange={(nextSortBy) => currentHub.updateFilters({ sortBy: nextSortBy })}
      />

      {error && (
        <Typography variant="body2" sx={{ color: (theme) => theme.ui.settings.errorText }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {activeTab === 0 && (
            <>
              {themes.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: "center", py: 8, color: (theme) => theme.ui.leaderboard.mutedText }}>
                  No themes found. Be the first to share a theme!
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                    gap: 3
                  }}
                >
                  {themes.map((theme) => (
                    <HubThemeCard
                      key={theme.id}
                      theme={theme}
                      onFavorite={handleFavoriteTheme}
                      onCopy={handleCopyTheme}
                    />
                  ))}
                </Box>
              )}
            </>
          )}

          {activeTab === 1 && (
            <>
              {variations.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: "center", py: 8, color: (theme) => theme.ui.leaderboard.mutedText }}>
                  No variations found. Be the first to share a variation!
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                    gap: 3
                  }}
                >
                  {variations.map((variation) => (
                    <HubVariationCard
                      key={variation.id}
                      variation={variation}
                      onFavorite={handleFavoriteVariation}
                      onCopy={handleCopyVariation}
                    />
                  ))}
                </Box>
              )}
            </>
          )}

          <HubPagination
            page={currentHub.currentPage}
            totalPages={currentHub.totalPages}
            onPageChange={(nextPage) => currentHub.updateFilters({ page: nextPage })}
          />
        </>
      )}
    </PageLayout>
  );
};
