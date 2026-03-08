import { Box, Stack, TextField, Typography } from "@mui/material";

type ColorPickerFieldProps = {
  label: string;
  value: string;
  onChange: (color: string) => void;
};

export const ColorPickerField = ({ label, value, onChange }: ColorPickerFieldProps) => {
  const isValidHex = (hex: string): boolean => {
    return /^#[0-9A-Fa-f]{6}$/.test(hex);
  };

  const handleHexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    // Allow partial input while typing
    if (newValue.startsWith("#") && newValue.length <= 7) {
      onChange(newValue);
      // Only validate complete hex values
      if (newValue.length === 7 && isValidHex(newValue)) {
        onChange(newValue);
      }
    }
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <Stack spacing={1}>
      <Typography variant="body2" component="label" htmlFor={`color-${label}`}>
        {label}
      </Typography>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Box
          component="input"
          type="color"
          id={`color-${label}`}
          value={isValidHex(value) ? value : "#000000"}
          onChange={handleColorChange}
          aria-label={`${label} color picker`}
          sx={{
            width: 56,
            height: 40,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            cursor: "pointer",
            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: 2
            }
          }}
        />
        <TextField
          value={value}
          onChange={handleHexChange}
          placeholder="#000000"
          size="small"
          error={value.length === 7 && !isValidHex(value)}
          helperText={value.length === 7 && !isValidHex(value) ? "Invalid hex color" : ""}
          inputProps={{
            maxLength: 7,
            "aria-label": `${label} hex value`,
            style: { fontFamily: "monospace" }
          }}
          sx={{ flex: 1 }}
        />
      </Box>
    </Stack>
  );
};