import { Box, Container, Stack, Typography } from "@mui/material";
import { ActionButton } from "../shared/ActionButton";
import { Panel } from "../shared/Panel";
import { approvedIcons } from "../../theme/approvedIcons";

type GameOverScreenProps = {
  score: number;
  onRestart: () => void;
};

export const GameOverScreen = ({ score, onRestart }: GameOverScreenProps) => {
  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Panel>
        <Stack spacing={3}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <ActionButton
              tone="neutral"
              icon={<approvedIcons.play />}
              iconOnly
              aria-label="Start a new game"
              onClick={onRestart}
            />
          </Box>
          <Typography variant="h4">Game Over</Typography>
          <Typography>Your score: {score}</Typography>
          <ActionButton icon={<approvedIcons.replay />} responsiveIconOnly onClick={onRestart}>
            Play Again
          </ActionButton>
        </Stack>
      </Panel>
    </Container>
  );
};
