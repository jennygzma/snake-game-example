import { useState } from "react";
import { PageLayout } from "../components/shared/PageLayout";
import { HubBrowser } from "../components/hub/HubBrowser";
import { Box, Typography } from "@mui/material";
import { useHub } from "../hooks/useHub";

export const HubPage = () => {
  const [activeTab, setActiveTab] = useState<"themes" | "variations">("themes");
  const hubData = useHub(activeTab);

  return (
    <PageLayout maxWidth="lg" spacing={4}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Community Hub
        </Typography>
        <Typography variant="body2" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
          Discover and favorite themes and game variations shared by the community
        </Typography>
      </Box>

      <HubBrowser
        themes={hubData.themes}
        variations={hubData.variations}
        themesPagination={hubData.themesPagination}
        variationsPagination={hubData.variationsPagination}
        favoritedThemeIds={hubData.favoritedThemeIds}
        favoritedVariationIds={hubData.favoritedVariationIds}
        isLoading={hubData.isLoading}
        onTabChange={setActiveTab}
        onQueryChange={hubData.onQueryChange}
        onDifficultyChange={hubData.onDifficultyChange}
        onSortChange={hubData.onSortChange}
        onPageChange={hubData.onPageChange}
        onFavoriteTheme={hubData.onFavoriteTheme}
        onUnfavoriteTheme={hubData.onUnfavoriteTheme}
        onCopyTheme={hubData.onCopyTheme}
        onFavoriteVariation={hubData.onFavoriteVariation}
        onUnfavoriteVariation={hubData.onUnfavoriteVariation}
        onCopyVariation={hubData.onCopyVariation}
        currentTab={activeTab}
        query={hubData.query}
        difficulty={hubData.difficulty}
        sortBy={hubData.sortBy}
      />
    </PageLayout>
  );
};
