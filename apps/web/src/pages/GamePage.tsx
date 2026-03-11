import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Stack, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { GameBoard } from "../components/game/GameBoard";
import { GameOverScreen } from "../components/game/GameOverScreen";
import { ActionButton } from "../components/shared/ActionButton";
import { PageLayout } from "../components/shared/PageLayout";
import { Panel } from "../components/shared/Panel";
import { useGame } from "../hooks/useGame";
import { useKeyboard } from "../hooks/useKeyboard";
import { useProfile } from "../hooks/useProfile";
import { useVariations } from "../hooks/useVariations";
import { apiGameService } from "../services/adapters/apiGameService";
import type { GameService } from "../services/gameService";
import { localGameService } from "../services/storage/localGameService";
import { approvedIcons } from "../theme/approvedIcons";

const resolveService = (): GameService => {
  const mode = import.meta.env.VITE_GAME_SERVICE_MODE;
  return mode === "local" ? localGameService : apiGameService;
};

export const GamePage = () => {
  const service = useMemo(resolveService, []);
  const { activeProfile } = useProfile();
  const { variations, loading: variationsLoading } = useVariations(activeProfile?.id);
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null);
  
  const selectedVariation = useMemo(
    () => variations.find((v) => v.id === selectedVariationId) || variations[0],
    [variations, selectedVariationId]
  );

  const { game, settings, player, highScore, error, startGame, resetGame, togglePause, turn } = useGame(
    service,
    activeProfile?.id
  );
  const serviceMode = import.meta.env.VITE_GAME_SERVICE_MODE === "local" ? "local" : "api";
  const pauseLabel = game.status === "paused" ? "Resume" : "Pause";
  const isGameOverView = game.status === "game-over";
  const [announcement, setAnnouncement] = useState("Snake loaded. Press Enter to start.");
  const previousStatusRef = useRef(game.status);
  const previousScoreRef = useRef(game.score);
  const previousHighScoreRef = useRef(highScore);

  useKeyboard({
    onDirection: turn,
    onTogglePause: togglePause,
    onStart: startGame,
    onReset: resetGame
  });

  useEffect(() => {
    const previousStatus = previousStatusRef.current;
    const previousScore = previousScoreRef.current;
    const previousHighScore = previousHighScoreRef.current;

    if (game.status !== previousStatus) {
      if (game.status === "running" && (previousStatus === "idle" || previousStatus === "game-over")) {
        setAnnouncement("Game started.");
      }
      if (game.status === "paused") {
        setAnnouncement("Game paused.");
      }
      if (game.status === "running" && previousStatus === "paused") {
        setAnnouncement("Game resumed.");
      }
      if (game.status === "game-over") {
        setAnnouncement(`Game over. Final score ${game.score}.`);
      }
    } else if (game.score > previousScore) {
      setAnnouncement(`Score ${game.score}.`);
    }

    if (highScore > previousHighScore) {
      setAnnouncement(`New high score ${highScore}.`);
    }

    previousStatusRef.current = game.status;
    previousScoreRef.current = game.score;
    previousHighScoreRef.current = highScore;
  }, [game.score, game.status, highScore]);

  if (isGameOverView) {
    return <GameOverScreen score={game.score} onRestart={startGame} />;
  }

  return (
    <PageLayout maxWidth="lg" spacing={2}>
        <Typography variant="caption" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
          Controls: Arrow Keys/WASD move, Space/P pause, Enter start, R reset
        </Typography>
        <Typography variant="body2" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
          Data source: {serviceMode} service
        </Typography>
        <Box
          role="status"
          aria-live="polite"
          aria-atomic="true"
          sx={{
            position: "absolute",
            width: 1,
            height: 1,
            p: 0,
            m: -1,
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0
          }}
        >
          {announcement}
        </Box>
        {error ? (
          <Box
            role="alert"
            sx={{
              p: 1.5,
              borderRadius: 1,
              border: "1px solid",
              borderColor: (theme) => theme.ui.feedback.errorBorder,
              bgcolor: (theme) => theme.ui.feedback.errorBg,
              color: (theme) => theme.ui.feedback.errorText
            }}
          >
            {error}
          </Box>
        ) : null}
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(460px, 1.6fr) minmax(300px, 1fr)"
            },
            alignItems: "stretch"
          }}
        >
          <Box>
            <Panel sx={{ height: "100%" }}>
              <GameBoard gridSize={settings.gridSize} snake={game.snake} foods={game.foods} />
            </Panel>
          </Box>
          <Box>
            <Panel sx={{ height: "100%" }}>
              <Stack spacing={2}>
                {!variationsLoading && variations.length > 0 && (
                  <FormControl fullWidth size="small">
                    <InputLabel id="variation-selector">Game Variation</InputLabel>
                    <Select
                      labelId="variation-selector"
                      value={selectedVariationId || variations[0]?.id || ""}
                      label="Game Variation"
                      onChange={(e) => setSelectedVariationId(e.target.value)}
                      inputProps={{ "aria-label": "Select game variation" }}
                    >
                      {variations.map((variation) => (
                        <MenuItem key={variation.id} value={variation.id}>
                          {variation.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                
                <Typography variant="h6" gutterBottom>
                  Score: {game.score}
                </Typography>
                <Typography variant="body2" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
                  High Score: {highScore}
                </Typography>
                <Stack direction={{ xs: "row", sm: "column" }} spacing={1.5} sx={{ mt: 2 }}>
                  <ActionButton
                    tone="play"
                    icon={<approvedIcons.play />}
                    responsiveIconOnly
                    onClick={startGame}
                  >
                    Start
                  </ActionButton>
                  <ActionButton
                    tone="pause"
                    icon={<approvedIcons.pause />}
                    responsiveIconOnly
                    onClick={togglePause}
                  >
                    {pauseLabel}
                  </ActionButton>
                  <ActionButton
                    tone="neutral"
                    icon={<approvedIcons.replay />}
                    responsiveIconOnly
                    onClick={resetGame}
                  >
                    Reset
                  </ActionButton>
                </Stack>
              </Stack>
            </Panel>
          </Box>
        </Box>
    </PageLayout>
  );
};
