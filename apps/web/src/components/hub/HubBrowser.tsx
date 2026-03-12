import { Box, Tabs, Tab, Typography, CircularProgress } from "@mui/material";
import type { SharedThemeWithCreator, SharedVariationWithCreator } from "@snake/contracts";
import { HubFilters } from "./HubFilters";
import { HubPagination } from "./HubPagination";
import { HubThemeCard } from "./HubThemeCard";
import { HubVariationCard } from "./HubVariationCard";

interface HubBrowserProps {
  themes: SharedThemeWithCreator[];
  variations: SharedVariationWithCreator[];
  themesPagination: { page: number; totalPages: number };
  variationsPagination: { page: number; totalPages: number };
  favoritedThemeIds: string[];
  favoritedVariationIds: string[];
  isLoading: boolean;
  onTabChange: (tab: "themes" | "variations") => void;
  onQueryChange: (query: string) => void;
  onDifficultyChange: (difficulty: "easy" | "medium" | "hard" | undefined) => void;
  onSortChange: (sortBy: "recent" | "popular" | "favorites") => void;
  onPageChange: (page: number) => void;
  onFavoriteTheme: (themeId: string) => void;
  onUnfavoriteTheme: (themeId: string) => void;
  onCopyTheme: (themeId: string) => void;
  onFavoriteVariation: (variationId: string) => void;
  onUnfavoriteVariation: (variationId: string) => void;
  onCopyVariation: (variationId: string) => void;
  currentTab: "themes" | "variations";
  query: string;
  difficulty?: "easy" | "medium" | "hard";
  sortBy: "recent" | "popular" | "favorites";
}

export const HubBrowser = ({
  themes,
  variations,
  themesPagination,
  variationsPagination,
  favoritedThemeIds,
  favoritedVariationIds,
  isLoading,
  onTabChange,
  onQueryChange,
  onDifficultyChange,
  onSortChange,
  onPageChange,
  onFavoriteTheme,
  onUnfavoriteTheme,
  onCopyTheme,
  onFavoriteVariation,
  onUnfavoriteVariation,
  onCopyVariation,
  currentTab,
  query,
  difficulty,
  sortBy
}: HubBrowserProps) => {
  const handleTabChange = (_event: React.SyntheticEvent, newValue: "themes" | "variations") => {
    onTabChange(newValue);
  };

  const currentPagination = currentTab === "themes" ? themesPagination : variationsPagination;
  const items = currentTab === "themes" ? themes : variations;

  return (
    <Box>
      {/* Tabs */}
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          borderBottom: 1,
          borderColor: "divider"
        }}
      >
        <Tab label="Themes" value="themes" />
        <Tab label="Variations" value="variations" />
      </Tabs>

      {/* Filters */}
      <HubFilters
        contentType={currentTab}
        query={query}
        difficulty={difficulty}
        sortBy={sortBy}
        onQueryChange={onQueryChange}
        onDifficultyChange={onDifficultyChange}
        onSortChange={onSortChange}
      />

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty State */}
      {!isLoading && items.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" gutterBottom>
            No {currentTab} found
          </Typography>
          <Typography variant="body2" sx={{ color: (theme) => theme.palette.text.secondary }}>
            {query
              ? `Try adjusting your search or filters`
              : `Be the first to share a ${currentTab === "themes" ? "theme" : "variation"}!`}
          </Typography>
        </Box>
      )}

      {/* Content Grid */}
      {!isLoading && items.length > 0 && (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)"
              },
              gap: 3,
              mb: 3
            }}
          >
            {currentTab === "themes"
              ? themes.map((theme) => (
                  <HubThemeCard
                    key={theme.id}
                    theme={theme}
                    isFavorited={favoritedThemeIds.includes(theme.id)}
                    onFavorite={onFavoriteTheme}
                    onUnfavorite={onUnfavoriteTheme}
                    onCopy={onCopyTheme}
                  />
                ))
              : variations.map((variation) => (
                  <HubVariationCard
                    key={variation.id}
                    variation={variation}
                    isFavorited={favoritedVariationIds.includes(variation.id)}
                    onFavorite={onFavoriteVariation}
                    onUnfavorite={onUnfavoriteVariation}
                    onCopy={onCopyVariation}
                  />
                ))}
          </Box>

          {/* Pagination */}
          <HubPagination
            currentPage={currentPagination.page}
            totalPages={currentPagination.totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </Box>
  );
};