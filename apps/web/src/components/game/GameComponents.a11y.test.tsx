import type { LeaderboardEntry, Profile } from "@snake/contracts";
import { ThemeProvider } from "@mui/material";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { appTheme } from "../../theme/theme";
import { GameBoard } from "./GameBoard";
import { GameOverScreen } from "./GameOverScreen";
import { LeaderboardPanel } from "./LeaderboardPanel";
import { ScorePanel } from "./ScorePanel";

const demoPlayer: Profile = {
  id: "player-1",
  name: "Jenny"
};

const leaderboardEntries: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: "u-1",
    score: 42,
    endedAt: "2026-03-08T12:00:00.000Z"
  },
  {
    rank: 2,
    userId: "u-2",
    score: 37,
    endedAt: "2026-03-07T12:00:00.000Z"
  }
];

describe("Game components accessibility", () => {
  it("GameBoard has no obvious violations", async () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <GameBoard
          gridSize={10}
          snake={[
            { x: 2, y: 5 },
            { x: 1, y: 5 },
            { x: 0, y: 5 }
          ]}
          food={{ x: 7, y: 3 }}
        />
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("ScorePanel has no obvious violations", async () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <ScorePanel player={demoPlayer} score={12} highScore={30} status="running" />
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("LeaderboardPanel has no obvious violations", async () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <LeaderboardPanel entries={leaderboardEntries} />
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("GameOverScreen has no obvious violations", async () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <GameOverScreen score={23} onRestart={() => {}} />
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
