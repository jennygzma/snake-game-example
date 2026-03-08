import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import ReplayRounded from "@mui/icons-material/ReplayRounded";

// Central approved icon registry. New icons must be added here only after user approval.
export const approvedIcons = {
  pause: PauseRounded,
  play: PlayArrowRounded,
  replay: ReplayRounded
} as const;

export const approvedIconNames = Object.keys(approvedIcons) as Array<keyof typeof approvedIcons>;
