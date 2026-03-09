import { Box, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { gameTokens } from "../../theme/tokens";

interface ColorPickerFieldProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  description?: string;
}

export const ColorPickerField = ({ label, value, onChange, description }: ColorPickerFieldProps) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <Stack spacing={1}>
      <Typography variant="body2" fontWeight={600}>
        {label}
      </Typography>
      {description && (
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      )}
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          onClick={() => setShowPicker(!showPicker)}
          sx={{
            width: 60,
            height: 40,
            bgcolor: value,
            border: 2,
            borderColor: gameTokens.colors.panelBorder,
            borderRadius: 1,
            cursor: "pointer",
            transition: "border-color 0.2s",
            "&:hover": {
              borderColor: gameTokens.colors.action
            }
          }}
        />
        <TextField
          size="small"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          sx={{ width: 120 }}
          inputProps={{
            style: { textTransform: "uppercase" }
          }}
        />
      </Stack>
      {showPicker && (
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1
            }}
            onClick={() => setShowPicker(false)}
          />
          <Box sx={{ position: "relative", zIndex: 2 }}>
            <HexColorPicker color={value} onChange={onChange} />
          </Box>
        </Box>
      )}
    </Stack>
  );
};