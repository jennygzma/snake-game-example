import AccountCircle from "@mui/icons-material/AccountCircle";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import Delete from "@mui/icons-material/Delete";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import ReplayRounded from "@mui/icons-material/ReplayRounded";
import SettingsRounded from "@mui/icons-material/SettingsRounded";
import SportsEsportsRounded from "@mui/icons-material/SportsEsportsRounded";
import Warning from "@mui/icons-material/Warning";

// Central approved icon registry. New icons must be added here only after user approval.
export const approvedIcons = {
  accountCircle: AccountCircle,
  barChart: BarChartRounded,
  delete: Delete,
  pause: PauseRounded,
  photoCamera: PhotoCamera,
  play: PlayArrowRounded,
  replay: ReplayRounded,
  settings: SettingsRounded,
  sportsEsports: SportsEsportsRounded,
  warning: Warning
} as const;

export const approvedIconNames = Object.keys(approvedIcons) as Array<keyof typeof approvedIcons>;
