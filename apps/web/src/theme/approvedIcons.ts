import BarChartRounded from "@mui/icons-material/BarChartRounded";
import HomeRounded from "@mui/icons-material/HomeRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import ReplayRounded from "@mui/icons-material/ReplayRounded";
import SettingsRounded from "@mui/icons-material/SettingsRounded";

// Central approved icon registry. New icons must be added here only after user approval.
export const approvedIcons = {
  barChart: BarChartRounded,
  home: HomeRounded,
  pause: PauseRounded,
  play: PlayArrowRounded,
  replay: ReplayRounded,
  settings: SettingsRounded
} as const;

export const approvedIconNames = Object.keys(approvedIcons) as Array<keyof typeof approvedIcons>;
