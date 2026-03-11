import { useState } from "react";
import { Box, Tab, Tabs, Typography, TextField, Select, MenuItem, FormControl, InputLabel, useTheme } from "@mui/material";
import { PageLayout } from "../components/shared/PageLayout";
import { IconActionButton } from "../components/shared/IconActionButton";
import { Panel } from "../components/shared/Panel";
import { ProfileAvatar } from "../components/shared/ProfileAvatar";
import { useHub } from "../hooks/useHub";
import { approvedIcons } from "../theme/approvedIcons";
import type { SharedThemeWithCreator, SharedVariationWithCreator } from "@snake/contracts";

export const HubPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const contentType = activeTab === 0 ? "themes" : "variations";

  const {
    items,
    loading,
    error,
    total,
    page,
    hasMore,
    query,
    difficulty,
    sortBy,
    handleSearch,
    handleDifficultyChange,
    handleSortChange,
    handlePageChange,
    favoriteItem,
    unfavoriteItem,
    copyToLocal
  } = useHub(contentType as "themes" | "variations");

  const handleFavoriteToggle = async (item: SharedThemeWithCreator | SharedVariationWithCreator) => {
    try {
      if (item.isFavorited) {
        await unfavoriteItem(item.id);
      } else {
        await favoriteItem(item.id);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handleCopy = async (item: SharedThemeWithCreator | SharedVariationWithCreator) => {
    try {
      await copyToLocal(item.id);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <PageLayout maxWidth="lg" spacing={4}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Hub
        </Typography>
        <Typography variant="body2" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
          Discover and share themes and game variations with the community
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: (theme) => theme.ui.stats.tabsBorder }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Themes" />
          <Tab label="Variations" />
        </Tabs>
      </Box>

      {/* Search and Filters */}
      <Panel>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            label="Search"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name or description..."
            sx={{ flexGrow: 1, minWidth: 250 }}
            size="small"
          />

          {activeTab === 1 && (
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficulty || "all"}
                label="Difficulty"
                onChange={(e) =>
                  handleDifficultyChange(
                    e.target.value === "all" ? undefined : (e.target.value as "easy" | "medium" | "hard")
                  )
                }
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          )}

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => handleSortChange(e.target.value as "newest" | "popular" | "favorites")}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="popular">Most Popular</MenuItem>
              <MenuItem value="favorites">Most Favorited</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Panel>

      {/* Results */}
      {loading && (
        <Typography variant="body2" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
          Loading...
        </Typography>
      )}

      {error && (
        <Typography variant="body2" sx={{ color: (theme) => theme.ui.settings.errorText }}>
          {error}
        </Typography>
      )}

      {!loading && !error && items.length === 0 && (
        <Typography variant="body2" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
          No {activeTab === 0 ? "themes" : "variations"} found. Try adjusting your search or filters.
        </Typography>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
              gap: 3
            }}
          >
            {items.map((item) => (
              <Panel key={item.id} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Header with creator info */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ProfileAvatar
                    src={item.creator.avatarBase64}
                    size={32}
                    iconSize={20}
                    bgColor={theme.ui.nav.profileAvatarBg}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.creator.profileName}
                    </Typography>
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {item.name}
                  </Typography>
                  {item.description && (
                    <Typography
                      variant="body2"
                      sx={{ color: (theme) => theme.ui.leaderboard.mutedText, mb: 1 }}
                    >
                      {item.description}
                    </Typography>
                  )}

                  {/* Stats */}
                  <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                    <Typography variant="caption" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
                      ❤️ {item.favoriteCount}
                    </Typography>
                    <Typography variant="caption" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
                      📥 {item.usageCount}
                    </Typography>
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                  <IconActionButton
                    size="small"
                    variant={item.isFavorited ? "contained" : "outlined"}
                    tone="primary"
                    icon={item.isFavorited ? <approvedIcons.check /> : <approvedIcons.add />}
                    label={item.isFavorited ? `Unfavorite ${item.name}` : `Favorite ${item.name}`}
                    iconOnly
                    onClick={() => void handleFavoriteToggle(item)}
                  />
                  <IconActionButton
                    size="small"
                    variant="contained"
                    tone="primary"
                    icon={<approvedIcons.add />}
                    label={`Copy ${item.name} to my ${activeTab === 0 ? "themes" : "variations"}`}
                    iconOnly
                    onClick={() => void handleCopy(item)}
                  />
                </Box>
              </Panel>
            ))}
          </Box>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
            <IconActionButton
              size="small"
              variant="outlined"
              tone="neutral"
              icon={<approvedIcons.swapHoriz sx={{ transform: "rotate(180deg)" }} />}
              label="Previous page"
              iconOnly
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            />
            <Typography variant="body2" sx={{ alignSelf: "center" }}>
              Page {page} of {Math.ceil(total / 20)}
            </Typography>
            <IconActionButton
              size="small"
              variant="outlined"
              tone="neutral"
              icon={<approvedIcons.swapHoriz />}
              label="Next page"
              iconOnly
              disabled={!hasMore}
              onClick={() => handlePageChange(page + 1)}
            />
          </Box>
        </>
      )}
    </PageLayout>
  );
};