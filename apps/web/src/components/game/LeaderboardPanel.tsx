import { Box, Divider, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { LeaderboardEntry } from "@snake/contracts";

const formatEndedAt = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

type LeaderboardPanelProps = {
  entries: LeaderboardEntry[];
  showProfileName?: boolean;
  showVariationName?: boolean;
};

export const LeaderboardPanel = ({
  entries,
  showProfileName = false,
  showVariationName = false
}: LeaderboardPanelProps) => {
  const theme = useTheme();

  return (
    <Stack spacing={1}>
      <Typography variant="h6">Leaderboard</Typography>
      {entries.length === 0 ? (
        <Typography variant="body2" sx={{ color: theme.ui.leaderboard.mutedText }}>
          No scores yet. Finish a run to create leaderboard entries.
        </Typography>
      ) : (
        <Stack divider={<Divider flexItem sx={{ borderColor: theme.ui.leaderboard.divider }} />}>
          {entries.map((entry) => (
            <Box
              key={`${entry.rank}-${entry.userId}-${entry.endedAt}`}
              sx={{
                display: "grid",
                gridTemplateColumns:
                  showProfileName && showVariationName
                    ? "48px 1fr 1fr 1fr auto"
                    : showProfileName
                      ? "48px 1fr 1fr auto"
                      : showVariationName
                        ? "48px 1fr 1fr auto"
                        : "48px 1fr auto",
                alignItems: "center",
                gap: 1,
                py: 1
              }}
            >
              <Typography variant="body2" sx={{ color: theme.ui.leaderboard.mutedText }}>
                #{entry.rank}
              </Typography>
              {showProfileName && (
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {entry.profileName}
                </Typography>
              )}
              {showVariationName && (
                <Typography variant="body2" sx={{ color: theme.ui.leaderboard.mutedText }}>
                  {entry.variationName ?? "Classic"}
                </Typography>
              )}
              <Typography variant="body2">{entry.score} pts</Typography>
              <Typography variant="caption" sx={{ color: theme.ui.leaderboard.mutedText }}>
                {formatEndedAt(entry.endedAt)}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
