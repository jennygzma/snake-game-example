import { createElement } from "react";
import { Box, Typography } from "@mui/material";
import { IconActionButton } from "../shared/IconActionButton";
import { approvedIcons } from "../../theme/approvedIcons";

interface HubPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const HubPagination = ({ currentPage, totalPages, onPageChange }: HubPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        py: 2
      }}
    >
      <IconActionButton
        icon={createElement(approvedIcons.navigateBefore)}
        label="Previous page"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      />
      <Typography
        variant="body2"
        sx={{
          color: (theme) => theme.palette.text.primary,
          minWidth: "100px",
          textAlign: "center"
        }}
      >
        Page {currentPage} of {totalPages}
      </Typography>
      <IconActionButton
        icon={createElement(approvedIcons.navigateNext)}
        label="Next page"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      />
    </Box>
  );
};
