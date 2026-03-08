import { useMemo } from "react";
import { Alert, Container, Stack, Typography } from "@mui/material";
import { LeaderboardPanel } from "../components/game/LeaderboardPanel";
import { ScorePanel } from "../components/game/ScorePanel";
import { useGame } from "../hooks/useGame";
import { apiGameService } from "../services/adapters/apiGameService";
import type { GameService } from "../services/gameService";
import { localGameService } from "../services/storage/localGameService";

const resolveService = (): GameService => {
  const mode = import.meta.env.VITE_GAME_SERVICE_MODE;
  return mode === "local" ? localGameService : apiGameService;
};

export const StatsPage = () => {
  const service = useMemo(resolveService, []);
  const { player, highScore, leaderboard, error } = useGame(service);
  const serviceMode = import.meta.env.VITE_GAME_SERVICE_MODE === "local" ? "local" : "api";

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4" gutterBottom>
          Statistics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Data source: {serviceMode} service
        </Typography>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <ScorePanel player={player} score={0} highScore={highScore} status="idle" />
        <LeaderboardPanel entries={leaderboard} />
      </Stack>
    </Container>
  );
};
