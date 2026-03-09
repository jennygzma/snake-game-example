import AccountCircleRounded from "@mui/icons-material/AccountCircleRounded";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import ReplayRounded from "@mui/icons-material/ReplayRounded";
import SettingsRounded from "@mui/icons-material/SettingsRounded";
import SportsEsportsRounded from "@mui/icons-material/SportsEsportsRounded";

// Central approved icon registry. New icons must be added here only after user approval.
export const approvedIcons = {
  accountCircle: AccountCircleRounded,
  barChart: BarChartRounded,
  pause: PauseRounded,
  play: PlayArrowRounded,
  replay: ReplayRounded,
  settings: SettingsRounded,
  sportsEsports: SportsEsportsRounded
} as const;

export const approvedIconNames = Object.keys(approvedIcons) as Array<keyof typeof approvedIcons>;
