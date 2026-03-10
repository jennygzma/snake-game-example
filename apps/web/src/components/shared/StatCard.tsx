import { Stack, Typography } from "@mui/material";
import { Panel } from "./Panel";

type StatCardProps = {
  label: string;
  value: string | number;
};

export const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <Panel>
      <Stack spacing={0.5}>
        <Typography variant="caption" sx={{ color: (theme) => theme.ui.statCard.labelText }}>
          {label}
        </Typography>
        <Typography variant="h6">{value}</Typography>
      </Stack>
    </Panel>
  );
};
