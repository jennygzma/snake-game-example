import { Box, Divider, Stack, Typography } from "@mui/material";
import type { LeaderboardEntry } from "@snake/contracts";

const formatEndedAt = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

type LeaderboardPanelProps = {
  entries: LeaderboardEntry[];
  showProfileName?: boolean;
};

export const LeaderboardPanel = ({ entries, showProfileName = false }: LeaderboardPanelProps) => {
  return (
    <Stack spacing={1}>
      <Typography variant="h6">Leaderboard</Typography>
      {entries.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No scores yet. Finish a run to create leaderboard entries.
        </Typography>
      ) : (
        <Stack divider={<Divider flexItem />}>
          {entries.map((entry) => (
            <Box
              key={`${entry.rank}-${entry.userId}-${entry.endedAt}`}
              sx={{
                display: "grid",
                gridTemplateColumns: showProfileName ? "48px 1fr 1fr auto" : "48px 1fr auto",
                alignItems: "center",
                py: 1,
                gap: 1
              }}
            >
              <Typography variant="body2" color="text.secondary">
                #{entry.rank}
              </Typography>
              <Typography variant="body2">{entry.score} pts</Typography>
              {showProfileName && (
                <Typography variant="body2" color="text.secondary">
                  {entry.profileName}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                {formatEndedAt(entry.endedAt)}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
