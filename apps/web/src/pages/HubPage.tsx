import { Typography } from "@mui/material";
import { HubBrowser } from "../components/hub/HubBrowser";
import { PageLayout } from "../components/shared/PageLayout";
import { useHub } from "../hooks/useHub";

export const HubPage = () => {
  const hub = useHub();

  return (
    <PageLayout maxWidth="lg" spacing={4}>
      <div>
        <Typography variant="h4" gutterBottom>
          Hub
        </Typography>
        <Typography variant="body2" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
          Discover and share themes and game variations
        </Typography>
      </div>

      <HubBrowser
        themes={hub.themes}
        themesLoading={hub.themesLoading}
        themesError={hub.themesError}
        themesFavorites={hub.themesFavorites}
        themesPage={hub.themesPage}
        themesTotalPages={hub.themesTotalPages}
        onThemesPageChange={hub.setThemesPage}
        onThemeFavorite={(id) => {
          void hub.favoriteTheme(id);
        }}
        onThemeUnfavorite={(id) => {
          void hub.unfavoriteTheme(id);
        }}
        onThemeCopy={(id) => {
          void hub.copyThemeToLocal(id);
        }}
        variations={hub.variations}
        variationsLoading={hub.variationsLoading}
        variationsError={hub.variationsError}
        variationsFavorites={hub.variationsFavorites}
        variationsPage={hub.variationsPage}
        variationsTotalPages={hub.variationsTotalPages}
        onVariationsPageChange={hub.setVariationsPage}
        onVariationFavorite={(id) => {
          void hub.favoriteVariation(id);
        }}
        onVariationUnfavorite={(id) => {
          void hub.unfavoriteVariation(id);
        }}
        onVariationCopy={(id) => {
          void hub.copyVariationToLocal(id);
        }}
        searchQuery={hub.searchQuery}
        onSearchChange={hub.setSearchQuery}
        difficulty={hub.difficulty}
        onDifficultyChange={hub.setDifficulty}
        sortBy={hub.sortBy}
        onSortChange={hub.setSortBy}
      />
    </PageLayout>
  );
};
