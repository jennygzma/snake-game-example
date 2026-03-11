import { useState } from "react";
import { Box, Tabs, Tab, Typography, CircularProgress } from "@mui/material";
import { HubFilters } from "./HubFilters";
import { HubThemeCard } from "./HubThemeCard";
import { HubVariationCard } from "./HubVariationCard";
import { HubPagination } from "./HubPagination";
import type { SharedThemeWithCreator, SharedVariationWithCreator } from "@snake/contracts";

interface HubBrowserProps {
  // State for themes tab
  themes: SharedThemeWithCreator[];
  themesLoading: boolean;
  themesError: string | null;
  themesFavorites: Set<string>;
  themesPage: number;
  themesTotalPages: number;
  onThemesPageChange: (page: number) => void;
  onThemeFavorite: (id: string) => void;
  onThemeUnfavorite: (id: string) => void;
  onThemeCopy: (id: string) => void;

  // State for variations tab
  variations: SharedVariationWithCreator[];
  variationsLoading: boolean;
  variationsError: string | null;
  variationsFavorites: Set<string>;
  variationsPage: number;
  variationsTotalPages: number;
  onVariationsPageChange: (page: number) => void;
  onVariationFavorite: (id: string) => void;
  onVariationUnfavorite: (id: string) => void;
  onVariationCopy: (id: string) => void;

  // Shared filter state
  searchQuery: string;
  onSearchChange: (query: string) => void;
  difficulty: "easy" | "medium" | "hard" | "";
  onDifficultyChange: (difficulty: "easy" | "medium" | "hard" | "") => void;
  sortBy: "newest" | "popular" | "mostUsed";
  onSortChange: (sort: "newest" | "popular" | "mostUsed") => void;
}

export const HubBrowser = ({
  themes,
  themesLoading,
  themesError,
  themesFavorites,
  themesPage,
  themesTotalPages,
  onThemesPageChange,
  onThemeFavorite,
  onThemeUnfavorite,
  onThemeCopy,
  variations,
  variationsLoading,
  variationsError,
  variationsFavorites,
  variationsPage,
  variationsTotalPages,
  onVariationsPageChange,
  onVariationFavorite,
  onVariationUnfavorite,
  onVariationCopy,
  searchQuery,
  onSearchChange,
  difficulty,
  onDifficultyChange,
  sortBy,
  onSortChange
}: HubBrowserProps) => {
  const [activeTab, setActiveTab] = useState<"themes" | "variations">("themes");

  const handleTabChange = (_event: React.SyntheticEvent, newValue: "themes" | "variations") => {
    setActiveTab(newValue);
  };

  const isThemesTab = activeTab === "themes";
  const loading = isThemesTab ? themesLoading : variationsLoading;
  const error = isThemesTab ? themesError : variationsError;
  const items = isThemesTab ? themes : variations;

  return (
    <Box>
      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="Hub content tabs"
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Themes" value="themes" aria-controls="themes-panel" />
        <Tab label="Variations" value="variations" aria-controls="variations-panel" />
      </Tabs>

      {/* Filters */}
      <HubFilters
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        difficulty={difficulty}
        onDifficultyChange={onDifficultyChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
        showDifficulty={!isThemesTab}
      />

      {/* Content */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: "center", py: 4 }}>
          {error}
        </Typography>
      ) : items.length === 0 ? (
        <Typography sx={{ textAlign: "center", py: 4 }}>
          No {isThemesTab ? "themes" : "variations"} found. Try adjusting your filters.
        </Typography>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)"
              },
              gap: 3
            }}
          >
            {isThemesTab
              ? themes.map((theme) => (
                  <HubThemeCard
                    key={theme.id}
                    theme={theme}
                    isFavorited={themesFavorites.has(theme.id)}
                    onFavorite={() => onThemeFavorite(theme.id)}
                    onUnfavorite={() => onThemeUnfavorite(theme.id)}
                    onCopy={() => onThemeCopy(theme.id)}
                  />
                ))
              : variations.map((variation) => (
                  <HubVariationCard
                    key={variation.id}
                    variation={variation}
                    isFavorited={variationsFavorites.has(variation.id)}
                    onFavorite={() => onVariationFavorite(variation.id)}
                    onUnfavorite={() => onVariationUnfavorite(variation.id)}
                    onCopy={() => onVariationCopy(variation.id)}
                  />
                ))}
          </Box>

          {/* Pagination */}
          <HubPagination
            currentPage={isThemesTab ? themesPage : variationsPage}
            totalPages={isThemesTab ? themesTotalPages : variationsTotalPages}
            onPageChange={isThemesTab ? onThemesPageChange : onVariationsPageChange}
          />
        </>
      )}
    </Box>
  );
};