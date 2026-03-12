import { Box, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { HubSortBy } from "@snake/contracts";

interface HubFiltersProps {
  searchQuery: string;
  difficulty?: "easy" | "medium" | "hard";
  sortBy: HubSortBy;
  showDifficulty?: boolean;
  onSearchChange: (query: string) => void;
  onDifficultyChange: (difficulty?: "easy" | "medium" | "hard") => void;
  onSortChange: (sortBy: HubSortBy) => void;
}

export const HubFilters = ({
  searchQuery,
  difficulty,
  sortBy,
  showDifficulty = false,
  onSearchChange,
  onDifficultyChange,
  onSortChange
}: HubFiltersProps) => {
  const muiTheme = useTheme();

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
      <TextField
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        sx={{ flexGrow: 1, minWidth: 200 }}
      />

      {showDifficulty && (
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={difficulty ?? ""}
            label="Difficulty"
            onChange={(e) => onDifficultyChange(e.target.value as "easy" | "medium" | "hard" | undefined)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>
      )}

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          label="Sort By"
          onChange={(e) => onSortChange(e.target.value as HubSortBy)}
        >
          <MenuItem value="recent">Recent</MenuItem>
          <MenuItem value="popular">Popular</MenuItem>
          <MenuItem value="favorites">Most Favorited</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};