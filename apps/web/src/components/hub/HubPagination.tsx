import { Box, Button, Typography } from "@mui/material";
import { IconActionButton } from "../shared/IconActionButton";
import { approvedIcons } from "../../theme/approvedIcons";
import { useTheme } from "@mui/material/styles";

interface HubPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const HubPagination = ({ currentPage, totalPages, onPageChange }: HubPaginationProps) => {
  const theme = useTheme();

  if (totalPages <= 1) {
    return null;
  }

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        mt: 4
      }}
    >
      <IconActionButton
        tone="neutral"
        icon={<approvedIcons.swapHoriz />}
        iconColor={theme.icons.swapHoriz || theme.icons.default}
        label="Previous"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        aria-label="Go to previous page"
      />

      <Typography variant="body2" sx={{ minWidth: 100, textAlign: "center" }}>
        Page {currentPage} of {totalPages}
      </Typography>

      <IconActionButton
        tone="neutral"
        icon={<approvedIcons.swapHoriz />}
        iconColor={theme.icons.swapHoriz || theme.icons.default}
        label="Next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        aria-label="Go to next page"
      />
    </Box>
  );
};