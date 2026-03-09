import AccountCircleRounded from "@mui/icons-material/AccountCircleRounded";
import AddRounded from "@mui/icons-material/AddRounded";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import DeleteRounded from "@mui/icons-material/DeleteRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PhotoCameraRounded from "@mui/icons-material/PhotoCameraRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import ReplayRounded from "@mui/icons-material/ReplayRounded";
import SettingsRounded from "@mui/icons-material/SettingsRounded";
import SportsEsportsRounded from "@mui/icons-material/SportsEsportsRounded";

// Central approved icon registry. New icons must be added here only after user approval.
export const approvedIcons = {
  accountCircle: AccountCircleRounded,
  add: AddRounded,
  barChart: BarChartRounded,
  delete: DeleteRounded,
  edit: EditRounded,
  pause: PauseRounded,
  photoCamera: PhotoCameraRounded,
  play: PlayArrowRounded,
  replay: ReplayRounded,
  settings: SettingsRounded,
  sportsEsports: SportsEsportsRounded
} as const;

export const approvedIconNames = Object.keys(approvedIcons) as Array<keyof typeof approvedIcons>;
