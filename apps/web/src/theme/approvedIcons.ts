import AddRounded from "@mui/icons-material/AddRounded";
import AccountCircle from "@mui/icons-material/AccountCircle";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import Delete from "@mui/icons-material/Delete";
import EditRounded from "@mui/icons-material/EditRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import PublicRounded from "@mui/icons-material/PublicRounded";
import ReplayRounded from "@mui/icons-material/ReplayRounded";
import SettingsRounded from "@mui/icons-material/SettingsRounded";
import SportsEsportsRounded from "@mui/icons-material/SportsEsportsRounded";
import SwapHorizRounded from "@mui/icons-material/SwapHorizRounded";
import Warning from "@mui/icons-material/Warning";

// Central approved icon registry. New icons must be added here only after user approval.
export const approvedIcons = {
  add: AddRounded,
  accountCircle: AccountCircle,
  barChart: BarChartRounded,
  check: CheckRounded,
  close: CloseRounded,
  delete: Delete,
  edit: EditRounded,
  pause: PauseRounded,
  photoCamera: PhotoCamera,
  play: PlayArrowRounded,
  public: PublicRounded,
  replay: ReplayRounded,
  settings: SettingsRounded,
  sportsEsports: SportsEsportsRounded,
  swapHoriz: SwapHorizRounded,
  warning: Warning
} as const;

export const approvedIconNames = Object.keys(approvedIcons) as Array<keyof typeof approvedIcons>;
