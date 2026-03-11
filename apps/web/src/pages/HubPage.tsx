import { useState } from "react";
import { Box, Tab, Tabs, Typography, CircularProgress } from "@mui/material";
import { PageLayout } from "../components/shared/PageLayout";
import { HubThemeCard } from "../components/hub/HubThemeCard";
import { HubVariationCard } from "../components/hub/HubVariationCard";
import { HubFilters } from "../components/hub/HubFilters";
import { HubPagination } from "../components/hub/HubPagination";
import type { HubSortBy, HubThemeWithCreator, HubVariationWithCreator } from "@snake/contracts";

export const HubPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | undefined>();
  const [sortBy, setSortBy] = useState<HubSortBy>("recent");
  const [page, setPage] = useState(1);

  // Placeholder data - will be replaced with useHub hook in step 9
  const loading = false;
  const themes: HubThemeWithCreator[] = [];
  const variations: HubVariationWithCreator[] = [];
  const themesTotal = 0;
  const variationsTotal = 0;
  const limit = 20;

  const handleFavoriteTheme = async (id: string) => {
    console.log("Favorite theme:", id);
    // Will be implemented with useHub hook
  };

  const handleCopyTheme = async (id: string) => {
    console.log("Copy theme:", id);
    // Will be implemented with useHub hook
  };

  const handleFavoriteVariation = async (id: string) => {
    console.log("Favorite variation:", id);
    // Will be implemented with useHub hook
  };

  const handleCopyVariation = async (id: string) => {
    console.log("Copy variation:", id);
    // Will be implemented with useHub hook
  };

  const totalPages = activeTab === 0
    ? Math.ceil(themesTotal / limit)
    : Math.ceil(variationsTotal / limit);

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
          setPage(1);
          setSearchQuery("");
          setDifficulty(undefined);
        }}>
          <Tab label="Themes" />
          <Tab label="Variations" />
        </Tabs>
      </Box>

      <HubFilters
        searchQuery={searchQuery}
        difficulty={difficulty}
        sortBy={sortBy}
        showDifficulty={activeTab === 1}
        onSearchChange={setSearchQuery}
        onDifficultyChange={setDifficulty}
        onSortChange={setSortBy}
      />

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
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </PageLayout>
  );
};