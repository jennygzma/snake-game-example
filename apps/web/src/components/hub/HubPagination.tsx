import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface HubPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const HubPagination = ({ page, totalPages, onPageChange }: HubPaginationProps) => {
  const muiTheme = useTheme();

  if (totalPages <= 1) return null;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 4 }}>
      <Button
        variant="outlined"
        size="small"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <Typography variant="body2" sx={{ color: muiTheme.ui.leaderboard.mutedText }}>
        Page {page} of {totalPages}
      </Typography>
      <Button
        variant="outlined"
        size="small"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </Box>
  );
};