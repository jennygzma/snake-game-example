import { Container, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { LeaderboardEntry, Profile } from "@snake/contracts";
import { LeaderboardPanel } from "../components/game/LeaderboardPanel";
import { ScorePanel } from "../components/game/ScorePanel";
import { Panel } from "../components/shared/Panel";
import { apiGameService } from "../services/adapters/apiGameService";
import type { GameService } from "../services/gameService";
import { localGameService } from "../services/storage/localGameService";

const resolveService = (): GameService => {
  const mode = import.meta.env.VITE_GAME_SERVICE_MODE;
  return mode === "local" ? localGameService : apiGameService;
};

export const StatsPage = () => {
  const service = useMemo(resolveService, []);
  const [player, setPlayer] = useState<Profile | null>(null);
  const [highScore, setHighScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [profileData, highScoreData, leaderboardData] = await Promise.all([
          service.getProfile(),
          service.getHighScore(),
          service.getLeaderboard(10)
        ]);

        setPlayer(profileData);
        setHighScore(highScoreData.highScore);
        setLeaderboard(leaderboardData.entries);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [service]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading statistics...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4">Player Statistics</Typography>

        <Panel>
          <Stack spacing={2}>
            <ScorePanel
              player={player}
              score={0}
              highScore={highScore}
              status="idle"
            />
            <LeaderboardPanel entries={leaderboard} />
          </Stack>
        </Panel>
      </Stack>
    </Container>
  );
};
