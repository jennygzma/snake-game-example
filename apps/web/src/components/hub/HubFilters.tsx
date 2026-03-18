import { Box, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

interface HubFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  difficulty?: "easy" | "medium" | "hard" | "";
  onDifficultyChange: (difficulty: "easy" | "medium" | "hard" | "") => void;
  sortBy: "newest" | "popular" | "mostUsed";
  onSortChange: (sort: "newest" | "popular" | "mostUsed") => void;
  showDifficulty?: boolean;
}

export const HubFilters = ({
  searchQuery,
  onSearchChange,
  difficulty = "",
  onDifficultyChange,
  sortBy,
  onSortChange,
  showDifficulty = false
}: HubFiltersProps) => {
  const handleDifficultyChange = (event: SelectChangeEvent) => {
    onDifficultyChange(event.target.value as "easy" | "medium" | "hard" | "");
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    onSortChange(event.target.value as "newest" | "popular" | "mostUsed");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        mb: 3
      }}
    >
      <TextField
        fullWidth
        label="Search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by name or description..."
        size="small"
        inputProps={{
          "aria-label": "Search themes and variations"
        }}
      />

      {showDifficulty && (
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="difficulty-filter-label">Difficulty</InputLabel>
          <Select
            labelId="difficulty-filter-label"
            value={difficulty}
            label="Difficulty"
            onChange={handleDifficultyChange}
            aria-label="Filter by difficulty"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>
      )}

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="sort-by-label">Sort By</InputLabel>
        <Select
          labelId="sort-by-label"
          value={sortBy}
          label="Sort By"
          onChange={handleSortChange}
          aria-label="Sort order"
        >
          <MenuItem value="newest">Newest</MenuItem>
          <MenuItem value="popular">Most Popular</MenuItem>
          <MenuItem value="mostUsed">Most Used</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};