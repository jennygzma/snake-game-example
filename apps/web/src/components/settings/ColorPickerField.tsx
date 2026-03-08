import { Box, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

type ColorPickerFieldProps = {
  label: string;
  value: string;
  onChange: (color: string) => void;
  helperText?: string;
};

export const ColorPickerField = ({ label, value, onChange, helperText }: ColorPickerFieldProps) => {
  const [localValue, setLocalValue] = useState(value);

  const handleColorChange = (newColor: string) => {
    setLocalValue(newColor);
    onChange(newColor);
  };

  const handleTextChange = (newColor: string) => {
    setLocalValue(newColor);
    // Validate hex color format before calling onChange
    if (/^#[0-9A-Fa-f]{6}$/.test(newColor) || /^#[0-9A-Fa-f]{3}$/.test(newColor)) {
      onChange(newColor);
    }
  };

  return (
    <Stack spacing={1}>
      <Typography variant="body2" fontWeight={600}>
        {label}
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          component="input"
          type="color"
          value={localValue.startsWith("#") ? localValue : "#000000"}
          onChange={(e) => handleColorChange(e.target.value)}
          sx={{
            width: 60,
            height: 40,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            cursor: "pointer",
            "&::-webkit-color-swatch-wrapper": {
              padding: 0
            },
            "&::-webkit-color-swatch": {
              border: "none",
              borderRadius: 1
            }
          }}
        />
        <TextField
          size="small"
          value={localValue}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="#000000"
          helperText={helperText}
          sx={{ flexGrow: 1 }}
          inputProps={{
            maxLength: 7,
            style: { fontFamily: "monospace" }
          }}
        />
      </Stack>
    </Stack>
  );
};