import { useMemo } from "react";
import { Typography } from "@mui/material";
import { LeaderboardPanel } from "../components/game/LeaderboardPanel";
import { ScorePanel } from "../components/game/ScorePanel";
import { PageLayout } from "../components/shared/PageLayout";
import { Panel } from "../components/shared/Panel";
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
  const { game, player, highScore, leaderboard } = useGame(service);

  return (
    <PageLayout maxWidth="md" spacing={3}>
        <Typography variant="h4">Game Statistics</Typography>
        
        <Panel>
          <ScorePanel
            player={player}
            score={game.score}
            highScore={highScore}
            status={game.status}
          />
        </Panel>

        <Panel>
          <LeaderboardPanel entries={leaderboard} />
        </Panel>
    </PageLayout>
  );
};
