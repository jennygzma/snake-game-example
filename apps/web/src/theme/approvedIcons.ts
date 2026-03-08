import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import ReplayRounded from "@mui/icons-material/ReplayRounded";
import SportsEsportsRounded from "@mui/icons-material/SportsEsportsRounded";
import LeaderboardRounded from "@mui/icons-material/LeaderboardRounded";
import SettingsRounded from "@mui/icons-material/SettingsRounded";

// Central approved icon registry. New icons must be added here only after user approval.
export const approvedIcons = {
  pause: PauseRounded,
  play: PlayArrowRounded,
  replay: ReplayRounded,
  game: SportsEsportsRounded,
  stats: LeaderboardRounded,
  settings: SettingsRounded
} as const;

export const approvedIconNames = Object.keys(approvedIcons) as Array<keyof typeof approvedIcons>;
