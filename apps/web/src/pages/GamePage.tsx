import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from "@mui/material";
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
  const { variations, incrementUsageCount } = useVariations(activeProfile?.id);
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null);

  const selectedVariation = useMemo(
    () => (selectedVariationId ? variations.find((variation) => variation.id === selectedVariationId) ?? null : null),
    [selectedVariationId, variations]
  );

  const { game, settings, highScore, error, startGame, resetGame, togglePause, turn } = useGame(
    service,
    activeProfile?.id,
    selectedVariation
  );

  const serviceMode = import.meta.env.VITE_GAME_SERVICE_MODE === "local" ? "local" : "api";
  const pauseLabel = game.status === "paused" ? "Resume" : "Pause";
  const isGameOverView = game.status === "game-over";
  const [announcement, setAnnouncement] = useState("Snake loaded. Press Enter to start.");
  const previousStatusRef = useRef(game.status);
  const previousScoreRef = useRef(game.score);
  const previousHighScoreRef = useRef(highScore);
  const previousVariationIdRef = useRef<string | null>(null);

  useKeyboard({
    onDirection: turn,
    onTogglePause: togglePause,
    onStart: startGame,
    onReset: resetGame
  });

  useEffect(() => {
    const savedVariationId = settings.variationId ?? null;
    if (savedVariationId !== selectedVariationId) {
      setSelectedVariationId(savedVariationId);
    }
  }, [selectedVariationId, settings.variationId]);

  useEffect(() => {
    const previousStatus = previousStatusRef.current;
    const previousScore = previousScoreRef.current;
    const previousHighScore = previousHighScoreRef.current;
    const previousVariationId = previousVariationIdRef.current;

    if (selectedVariationId !== previousVariationId) {
      setAnnouncement(`Switched to ${selectedVariation?.name ?? "Classic"} variation.`);
      previousVariationIdRef.current = selectedVariationId;
    }

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
  }, [game.score, game.status, highScore, selectedVariation, selectedVariationId]);

  const handleVariationChange = async (nextVariationId: string | null) => {
    setSelectedVariationId(nextVariationId);
    try {
      const persisted = await service.getSettings();
      await service.saveSettings({
        speed: persisted.speed,
        gridSize: persisted.gridSize,
        variationId: nextVariationId ?? undefined
      });
    } catch {
      setAnnouncement("Failed to persist selected variation.");
    }
  };

  const handleStartGame = async () => {
    startGame();
    if (selectedVariationId) {
      await incrementUsageCount(selectedVariationId);
    }
  };

  if (isGameOverView) {
    return <GameOverScreen score={game.score} onRestart={handleStartGame} />;
  }

  return (
    <PageLayout maxWidth="lg" spacing={2}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="caption" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
            Controls: Arrow Keys/WASD move, Space/P pause, Enter start, R reset
          </Typography>
          <Typography variant="body2" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
            Data source: {serviceMode} service
          </Typography>
          <Typography variant="body2" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
            Variation: {selectedVariation?.name ?? "Classic"}
          </Typography>
        </Box>

        <FormControl sx={{ minWidth: 240 }}>
          <InputLabel id="variation-select-label">Game Variation</InputLabel>
          <Select
            labelId="variation-select-label"
            value={selectedVariationId ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              void handleVariationChange(typeof value === "string" && value.length > 0 ? value : null);
            }}
            label="Game Variation"
            aria-label="Select game variation"
          >
            <MenuItem value="">
              <em>Classic (Default)</em>
            </MenuItem>
            {variations.map((variation) => (
              <MenuItem key={variation.id} value={variation.id}>
                {variation.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

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
            <GameBoard
              gridSize={settings.gridSize}
              snake={game.snake}
              foods={game.foods}
              snakeHeadImage={selectedVariation?.snakeHeadImage}
              boardBackgroundColor={selectedVariation?.customColors?.boardBg}
              snakeColor={selectedVariation?.customColors?.snake}
              snakeHeadColor={selectedVariation?.customColors?.snakeHead}
              boardGridColor={selectedVariation?.customColors?.boardGrid}
            />
          </Panel>
        </Box>
        <Box>
          <Panel sx={{ height: "100%" }}>
            <Stack spacing={2}>
              <Typography variant="h6" gutterBottom>
                Score: {game.score}
              </Typography>
              <Typography variant="body2" sx={{ color: (theme) => theme.ui.leaderboard.mutedText }}>
                High Score: {highScore}
              </Typography>
              <Stack direction={{ xs: "row", sm: "column" }} spacing={1.5} sx={{ mt: 2 }}>
                <ActionButton tone="play" icon={<approvedIcons.play />} responsiveIconOnly onClick={() => void handleStartGame()}>
                  Start
                </ActionButton>
                <ActionButton tone="pause" icon={<approvedIcons.pause />} responsiveIconOnly onClick={togglePause}>
                  {pauseLabel}
                </ActionButton>
                <ActionButton tone="neutral" icon={<approvedIcons.replay />} responsiveIconOnly onClick={resetGame}>
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
