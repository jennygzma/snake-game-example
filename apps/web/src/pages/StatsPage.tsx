import { useEffect, useMemo, useState } from "react";
import { Typography, Tabs, Tab, Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { LeaderboardEntry } from "@snake/contracts";
import { LeaderboardPanel } from "../components/game/LeaderboardPanel";
import { ScorePanel } from "../components/game/ScorePanel";
import { PageLayout } from "../components/shared/PageLayout";
import { Panel } from "../components/shared/Panel";
import { useGame } from "../hooks/useGame";
import { useProfile } from "../hooks/useProfile";
import { useVariations } from "../hooks/useVariations";
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
  const { variations } = useVariations(activeProfile?.id);
  const { game, player, highScore, activeLeaderboard, globalLeaderboard } = useGame(
    service,
    activeProfile?.id
  );
  const [tabIndex, setTabIndex] = useState(0);
  const [variationFilterId, setVariationFilterId] = useState<string>("");
  const [filteredActiveEntries, setFilteredActiveEntries] = useState<LeaderboardEntry[]>(activeLeaderboard);
  const [filteredGlobalEntries, setFilteredGlobalEntries] = useState<LeaderboardEntry[]>(globalLeaderboard);

  const globalLeaderboardWithResolvedNames = useMemo<LeaderboardEntry[]>(() => {
    if (filteredGlobalEntries.length === 0) return filteredGlobalEntries;

    const profileNameById = new Map(profiles.map((profile) => [profile.id, profile.name]));

    return filteredGlobalEntries.map((entry) => {
      const matchedName = profileNameById.get(entry.userId);
      const fallbackName =
        entry.profileName === "Player" && activeProfile ? activeProfile.name : entry.profileName;

      return {
        ...entry,
        profileName: matchedName ?? fallbackName
      };
    });
  }, [activeProfile, filteredGlobalEntries, profiles]);

  useEffect(() => {
    const load = async () => {
      const activeResponse = await service.getLeaderboard(
        10,
        "active",
        variationFilterId || undefined
      );
      const globalResponse = await service.getLeaderboard(
        10,
        "global",
        variationFilterId || undefined
      );
      setFilteredActiveEntries(activeResponse.entries);
      setFilteredGlobalEntries(globalResponse.entries);
    };

    void load();
  }, [service, variationFilterId]);

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
          <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel id="stats-variation-filter">Variation Filter</InputLabel>
              <Select
                labelId="stats-variation-filter"
                label="Variation Filter"
                value={variationFilterId}
                onChange={(event) => setVariationFilterId(event.target.value)}
              >
                <MenuItem value="">All variations</MenuItem>
                {variations.map((variation) => (
                  <MenuItem key={variation.id} value={variation.id}>
                    {variation.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
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
              <LeaderboardPanel entries={filteredActiveEntries} showProfileName={false} showVariationName />
            )}
          </Box>

          <Box role="tabpanel" hidden={tabIndex !== 1}>
            {tabIndex === 1 && (
              <LeaderboardPanel entries={globalLeaderboardWithResolvedNames} showProfileName={true} showVariationName />
            )}
          </Box>
        </Panel>
    </PageLayout>
  );
};
