import { Stack, Typography } from "@mui/material";
import type { Profile } from "@snake/contracts";
import type { GameStatus } from "../../types/game";
import { StatCard } from "../shared/StatCard";

type ScorePanelProps = {
  player: Profile | null;
  score: number;
  highScore: number;
  status: GameStatus;
};

export const ScorePanel = ({ player, score, highScore, status }: ScorePanelProps) => {
  return (
    <Stack spacing={1.5}>
      <Typography variant="h5">Snake</Typography>
      <Typography variant="body2" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
        {player ? `Player: ${player.name}` : "Loading player..."}
      </Typography>
      <StatCard label="Score" value={score} />
      <StatCard label="High Score" value={highScore} />
      <StatCard label="Status" value={status} />
    </Stack>
  );
};
