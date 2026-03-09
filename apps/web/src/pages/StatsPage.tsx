import { useMemo, useState } from "react";
import { Typography, Tabs, Tab, Box } from "@mui/material";
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
  const { game, highScore, leaderboard } = useGame(service);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <PageLayout maxWidth="md" spacing={3}>
        <Typography variant="h4">Game Statistics</Typography>
        
        <Panel>
          <ScorePanel
            score={game.score}
            highScore={highScore}
            status={game.status}
          />
        </Panel>

        <Panel>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
            <Tab label="My Scores" />
            <Tab label="All Profiles" />
          </Tabs>

          <Box role="tabpanel" hidden={activeTab !== 0}>
            {activeTab === 0 && (
              <LeaderboardPanel entries={leaderboard} showProfileName={false} />
            )}
          </Box>

          <Box role="tabpanel" hidden={activeTab !== 1}>
            {activeTab === 1 && (
              <LeaderboardPanel entries={leaderboard} showProfileName={true} />
            )}
          </Box>
        </Panel>
    </PageLayout>
  );
};