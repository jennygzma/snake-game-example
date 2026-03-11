import { useMemo, useState } from "react";
import { Typography, Tabs, Tab, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { LeaderboardEntry } from "@snake/contracts";
import { LeaderboardPanel } from "../components/game/LeaderboardPanel";
import { ScorePanel } from "../components/game/ScorePanel";
import { PageLayout } from "../components/shared/PageLayout";
import { Panel } from "../components/shared/Panel";
import { useGame } from "../hooks/useGame";
import { useProfile } from "../hooks/useProfile";
import { apiGameService } from "../services/adapters/apiGameService";
import type { GameService } from "../services/gameService";
import { localGameService } from "../services/storage/localGameService";

const resolveService = (): GameService => {
  const mode = import.meta.env.VITE_GAME_SERVICE_MODE;
  return mode === "local" ? localGameService : apiGameService;
};

export const StatsPage = () => {
  const theme = useTheme();
  const service = useMemo(resolveService, []);
  const { activeProfile, profiles } = useProfile();
  const { game, player, highScore, activeLeaderboard, globalLeaderboard } = useGame(
    service,
    activeProfile?.id
  );
  const [tabIndex, setTabIndex] = useState(0);

  const globalLeaderboardWithResolvedNames = useMemo<LeaderboardEntry[]>(() => {
    if (globalLeaderboard.length === 0) return globalLeaderboard;

    const profileNameById = new Map(profiles.map((profile) => [profile.id, profile.name]));

    return globalLeaderboard.map((entry) => {
      const matchedName = profileNameById.get(entry.userId);
      const fallbackName =
        entry.profileName === "Player" && activeProfile ? activeProfile.name : entry.profileName;

      return {
        ...entry,
        profileName: matchedName ?? fallbackName
      };
    });
  }, [activeProfile, globalLeaderboard, profiles]);

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
          <Tabs 
            value={tabIndex} 
            onChange={(_, newValue) => setTabIndex(newValue)}
            sx={{ borderBottom: 1, borderColor: theme.ui.stats.tabsBorder, mb: 2 }}
          >
            <Tab label="My Scores" />
            <Tab label="All Profiles" />
          </Tabs>

          <Box role="tabpanel" hidden={tabIndex !== 0}>
            {tabIndex === 0 && (
              <LeaderboardPanel entries={activeLeaderboard} showProfileName={false} />
            )}
          </Box>

          <Box role="tabpanel" hidden={tabIndex !== 1}>
            {tabIndex === 1 && (
              <LeaderboardPanel entries={globalLeaderboardWithResolvedNames} showProfileName={true} />
            )}
          </Box>
        </Panel>
    </PageLayout>
  );
};
