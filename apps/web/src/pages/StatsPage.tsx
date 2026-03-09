import { useMemo, useState } from "react";
import { Typography, Tabs, Tab, Box } from "@mui/material";
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
  const service = useMemo(resolveService, []);
  const { game, player, highScore, leaderboard } = useGame(service);
  const { profiles, activeProfile } = useProfile();
  const [tabIndex, setTabIndex] = useState(0);

  const leaderboardWithResolvedNames = useMemo<LeaderboardEntry[]>(() => {
    if (leaderboard.length === 0) return leaderboard;

    const profileNameById = new Map(profiles.map((profile) => [profile.id, profile.name]));

    return leaderboard.map((entry) => {
      const matchedName = profileNameById.get(entry.userId);
      const fallbackName =
        entry.profileName === "Player" && activeProfile ? activeProfile.name : entry.profileName;

      return {
        ...entry,
        profileName: matchedName ?? fallbackName
      };
    });
  }, [activeProfile, leaderboard, profiles]);

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
            sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
          >
            <Tab label="My Scores" />
            <Tab label="All Profiles" />
          </Tabs>

          <Box role="tabpanel" hidden={tabIndex !== 0}>
            {tabIndex === 0 && (
              <LeaderboardPanel entries={leaderboardWithResolvedNames} showProfileName={false} />
            )}
          </Box>

          <Box role="tabpanel" hidden={tabIndex !== 1}>
            {tabIndex === 1 && (
              <LeaderboardPanel entries={leaderboardWithResolvedNames} showProfileName={true} />
            )}
          </Box>
        </Panel>
    </PageLayout>
  );
};
