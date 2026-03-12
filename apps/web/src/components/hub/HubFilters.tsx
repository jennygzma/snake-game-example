import { createElement, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  type SelectChangeEvent
} from "@mui/material";
import { approvedIcons } from "../../theme/approvedIcons";

interface HubFiltersProps {
  contentType: "themes" | "variations";
  query: string;
  difficulty?: "easy" | "medium" | "hard";
  sortBy: "recent" | "popular" | "favorites";
  onQueryChange: (query: string) => void;
  onDifficultyChange: (difficulty: "easy" | "medium" | "hard" | undefined) => void;
  onSortChange: (sortBy: "recent" | "popular" | "favorites") => void;
}

export const HubFilters = ({
  contentType,
  query,
  difficulty,
  sortBy,
  onQueryChange,
  onDifficultyChange,
  onSortChange
}: HubFiltersProps) => {
  const [localQuery, setLocalQuery] = useState(query);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  const handleQueryBlur = () => {
    onQueryChange(localQuery);
  };

  const handleQueryKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onQueryChange(localQuery);
    }
  };

  const handleDifficultyChange = (e: SelectChangeEvent) => {
    const value = e.target.value;
    onDifficultyChange(value === "all" ? undefined : (value as "easy" | "medium" | "hard"));
  };

  const handleSortChange = (e: SelectChangeEvent) => {
    onSortChange(e.target.value as "recent" | "popular" | "favorites");
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
        size="small"
        placeholder={`Search ${contentType}...`}
        value={localQuery}
        onChange={handleQueryChange}
        onBlur={handleQueryBlur}
        onKeyPress={handleQueryKeyPress}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {createElement(approvedIcons.search, {
                sx: { color: (theme: any) => theme.palette.action.active }
              })}
            </InputAdornment>
          )
        }}
        sx={{
          flex: 1,
          "& .MuiOutlinedInput-root": {
            bgcolor: (theme) => theme.palette.background.paper
          }
        }}
      />

      {contentType === "variations" && (
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="difficulty-label">Difficulty</InputLabel>
          <Select
            labelId="difficulty-label"
            value={difficulty || "all"}
            label="Difficulty"
            onChange={handleDifficultyChange}
            sx={{
              bgcolor: (theme) => theme.palette.background.paper
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>
      )}

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="sort-label">Sort By</InputLabel>
        <Select
          labelId="sort-label"
          value={sortBy}
          label="Sort By"
          onChange={handleSortChange}
          sx={{
            bgcolor: (theme) => theme.palette.background.paper
          }}
        >
          <MenuItem value="recent">Most Recent</MenuItem>
          <MenuItem value="popular">Most Popular</MenuItem>
          <MenuItem value="favorites">Most Favorited</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};