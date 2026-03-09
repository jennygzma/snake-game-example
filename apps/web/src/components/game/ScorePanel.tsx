import { Stack, Typography } from "@mui/material";
import type { GameStatus } from "../../types/game";
import { StatCard } from "../shared/StatCard";

type ScorePanelProps = {
  score: number;
  highScore: number;
  status: GameStatus;
};

export const ScorePanel = ({ score, highScore, status }: ScorePanelProps) => {
  return (
    <Stack spacing={1.5}>
      <Typography variant="h5">Snake</Typography>
      <StatCard label="Score" value={score} />
      <StatCard label="High Score" value={highScore} />
      <StatCard label="Status" value={status} />
    </Stack>
  );
};