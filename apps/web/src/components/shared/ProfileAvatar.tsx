import { Avatar, type AvatarProps } from "@mui/material";
import { approvedIcons } from "../../theme/approvedIcons";

const AccountCircleIcon = approvedIcons.accountCircle;

type ProfileAvatarProps = Omit<AvatarProps, "src"> & {
  src?: string | null;
  size?: number;
  iconSize?: number;
  bgColor?: string;
};

export const ProfileAvatar = ({
  src,
  size = 40,
  iconSize,
  bgColor,
  sx,
  ...rest
}: ProfileAvatarProps) => {
  return (
    <Avatar
      src={src || undefined}
      sx={{
        width: size,
        height: size,
        ...(bgColor ? { bgcolor: bgColor } : {}),
        ...sx
      }}
      {...rest}
    >
      {!src ? <AccountCircleIcon sx={{ width: iconSize ?? size * 0.7, height: iconSize ?? size * 0.7 }} /> : null}
    </Avatar>
  );
};
