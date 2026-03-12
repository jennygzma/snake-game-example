import AddRounded from "@mui/icons-material/AddRounded";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Delete from "@mui/icons-material/Delete";
import EditRounded from "@mui/icons-material/EditRounded";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import FilterList from "@mui/icons-material/FilterList";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import NavigateNext from "@mui/icons-material/NavigateNext";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import Public from "@mui/icons-material/Public";
import ReplayRounded from "@mui/icons-material/ReplayRounded";
import Search from "@mui/icons-material/Search";
import SettingsRounded from "@mui/icons-material/SettingsRounded";
import SportsEsportsRounded from "@mui/icons-material/SportsEsportsRounded";
import SwapHorizRounded from "@mui/icons-material/SwapHorizRounded";
import Warning from "@mui/icons-material/Warning";

// Central approved icon registry. New icons must be added here only after user approval.
export const approvedIcons = {
  add: AddRounded,
  accountCircle: AccountCircle,
  arrowDownward: ArrowDownward,
  arrowUpward: ArrowUpward,
  barChart: BarChartRounded,
  check: CheckRounded,
  close: CloseRounded,
  contentCopy: ContentCopy,
  delete: Delete,
  edit: EditRounded,
  favorite: Favorite,
  favoriteBorder: FavoriteBorder,
  filterList: FilterList,
  navigateBefore: NavigateBefore,
  navigateNext: NavigateNext,
  pause: PauseRounded,
  photoCamera: PhotoCamera,
  play: PlayArrowRounded,
  public: Public,
  replay: ReplayRounded,
  search: Search,
  settings: SettingsRounded,
  sportsEsports: SportsEsportsRounded,
  swapHoriz: SwapHorizRounded,
  warning: Warning
} as const;

export const approvedIconNames = Object.keys(approvedIcons) as Array<keyof typeof approvedIcons>;
