import { Stack, Typography } from "@mui/material";
import ReplayRounded from "@mui/icons-material/ReplayRounded";
import { ActionButton } from "../shared/ActionButton";
import { ModalShell } from "../shared/ModalShell";

type GameOverScreenProps = {
  open: boolean;
  score: number;
  onRestart: () => void;
};

export const GameOverScreen = ({ open, score, onRestart }: GameOverScreenProps) => {
  const titleId = "game-over-title";
  const descriptionId = "game-over-description";

  return (
    <ModalShell open={open} ariaLabelledBy={titleId} ariaDescribedBy={descriptionId}>
      <Stack spacing={2}>
        <Typography id={titleId} variant="h5">
          Game Over
        </Typography>
        <Typography id={descriptionId}>Your score: {score}</Typography>
        <ActionButton icon={<ReplayRounded />} responsiveIconOnly onClick={onRestart}>
          Play Again
        </ActionButton>
      </Stack>
    </ModalShell>
  );
};
