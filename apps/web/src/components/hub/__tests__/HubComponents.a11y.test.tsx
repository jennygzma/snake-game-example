import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { HubThemeCard } from "../HubThemeCard";
import { HubVariationCard } from "../HubVariationCard";
import { HubFilters } from "../HubFilters";
import { HubPagination } from "../HubPagination";
import { ShareDialog } from "../ShareDialog";
import { appTheme } from "../../../theme/theme";
import type { SharedThemeWithCreator, SharedVariationWithCreator } from "@snake/contracts";

expect.extend(toHaveNoViolations);

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider theme={appTheme}>{children}</ThemeProvider>
  </BrowserRouter>
);

const mockTheme: SharedThemeWithCreator = {
  id: "theme-1",
  creatorProfileId: "profile-1",
  name: "Test Theme",
  description: "A test theme",
  fontFamily: "Inter",
  colors: {
    bg: "#1a1a1a",
    panel: "#2d2d2d",
    panelBorder: "#3d3d3d",
    text: "#e0e0e0",
    textMuted: "#a0a0a0",
    snake: "#4caf50",
    snakeHead: "#66bb6a",
    food: "#ff5722",
    boardBg: "#121212",
    boardGrid: "#252525",
    action: "#2196f3",
    actionHover: "#1976d2",
    actionText: "#ffffff",
    pause: "#ff9800",
    pauseHover: "#f57c00",
    pauseText: "#ffffff",
    neutral: "#757575",
    neutralHover: "#616161",
    neutralText: "#ffffff",
    danger: "#f44336",
    dangerHover: "#d32f2f",
    dangerText: "#ffffff"
  },
  iconColors: {
    default: "#e0e0e0"
  },
  favoriteCount: 10,
  usageCount: 50,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  creator: {
    id: "profile-1",
    name: "Test Creator"
  }
};

const mockVariation: SharedVariationWithCreator = {
  id: "variation-1",
  creatorProfileId: "profile-1",
  name: "Test Variation",
  description: "A test variation",
  difficulty: "medium",
  baseSpeed: 8,
  gridSize: 20,
  maxConcurrentFoods: 3,
  powerupTypes: [],
  favoriteCount: 15,
  usageCount: 75,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  creator: {
    id: "profile-1",
    name: "Test Creator"
  }
};

describe("Hub Components Accessibility", () => {
  describe("HubThemeCard", () => {
    it("should not have accessibility violations", async () => {
      const { container } = render(
        <Wrapper>
          <HubThemeCard
            theme={mockTheme}
            isFavorited={false}
            onFavorite={() => {}}
            onUnfavorite={() => {}}
            onCopy={() => {}}
          />
        </Wrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should not have accessibility violations when favorited", async () => {
      const { container } = render(
        <Wrapper>
          <HubThemeCard
            theme={mockTheme}
            isFavorited={true}
            onFavorite={() => {}}
            onUnfavorite={() => {}}
            onCopy={() => {}}
          />
        </Wrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("HubVariationCard", () => {
    it("should not have accessibility violations", async () => {
      const { container } = render(
        <Wrapper>
          <HubVariationCard
            variation={mockVariation}
            isFavorited={false}
            onFavorite={() => {}}
            onUnfavorite={() => {}}
            onCopy={() => {}}
          />
        </Wrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("HubFilters", () => {
    it("should not have accessibility violations", async () => {
      const { container } = render(
        <Wrapper>
          <HubFilters
            searchQuery=""
            onSearchChange={() => {}}
            difficulty=""
            onDifficultyChange={() => {}}
            sortBy="newest"
            onSortChange={() => {}}
            showDifficulty={true}
          />
        </Wrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should not have accessibility violations without difficulty filter", async () => {
      const { container } = render(
        <Wrapper>
          <HubFilters
            searchQuery=""
            onSearchChange={() => {}}
            difficulty=""
            onDifficultyChange={() => {}}
            sortBy="newest"
            onSortChange={() => {}}
            showDifficulty={false}
          />
        </Wrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("HubPagination", () => {
    it("should not have accessibility violations", async () => {
      const { container } = render(
        <Wrapper>
          <HubPagination currentPage={2} totalPages={5} onPageChange={() => {}} />
        </Wrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should not have accessibility violations on first page", async () => {
      const { container } = render(
        <Wrapper>
          <HubPagination currentPage={1} totalPages={5} onPageChange={() => {}} />
        </Wrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should not have accessibility violations on last page", async () => {
      const { container } = render(
        <Wrapper>
          <HubPagination currentPage={5} totalPages={5} onPageChange={() => {}} />
        </Wrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("ShareDialog", () => {
    it("should not have accessibility violations when open", async () => {
      const { container } = render(
        <Wrapper>
          <ShareDialog
            open={true}
            itemType="theme"
            itemName="Test Theme"
            onClose={() => {}}
            onShare={() => {}}
          />
        </Wrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should not have accessibility violations for variation", async () => {
      const { container } = render(
        <Wrapper>
          <ShareDialog
            open={true}
            itemType="variation"
            itemName="Test Variation"
            onClose={() => {}}
            onShare={() => {}}
          />
        </Wrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});