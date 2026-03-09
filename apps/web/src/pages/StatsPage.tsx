import { useMemo, useState, useEffect } from "react";
import { Typography, Tabs, Tab, Box, Stack } from "@mui/material";
import { LeaderboardPanel } from "../components/game/LeaderboardPanel";
import { ScorePanel } from "../components/game/ScorePanel";
import { PageLayout } from "../components/shared/PageLayout";
import { Panel } from "../components/shared/Panel";
import { useGame } from "../hooks/useGame";
import { useProfileContext } from "../contexts/ProfileContext";
import { apiGameService } from "../services/adapters/apiGameService";
import type { GameService } from "../services/gameService";
import { localGameService } from "../services/storage/localGameService";
import type { LeaderboardEntry } from "@snake/contracts";

const resolveService = (): GameService => {
  const mode = import.meta.env.VITE_GAME_SERVICE_MODE;
  return mode === "local" ? localGameService : apiGameService;
};

export const StatsPage = () => {
  const service = useMemo(resolveService, []);
  const { game, player, highScore, leaderboard } = useGame(service);
  const { activeProfile } = useProfileContext();
  const [currentTab, setCurrentTab] = useState(0);
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const loadGlobalLeaderboard = async () => {
      const response = await service.getLeaderboardGlobal(10);
      setGlobalLeaderboard(response.entries);
    };
    loadGlobalLeaderboard();
  }, [service]);

  return (
    <PageLayout maxWidth="md" spacing={3}>
        <Typography variant="h4">Game Statistics</Typography>
        
        <Panel>
          <ScorePanel
            player={activeProfile}
            score={game.score}
            highScore={highScore}
            status={game.status}
          />
        </Panel>

        <Panel>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
              <Tab label="My Scores" />
              <Tab label="All Profiles" />
            </Tabs>
          </Box>

          {currentTab === 0 && (
            <LeaderboardPanel entries={leaderboard} showProfileName={false} />
          )}
          {currentTab === 1 && (
            <LeaderboardPanel entries={globalLeaderboard} showProfileName={true} />
          )}
        </Panel>
    </PageLayout>
  );
};