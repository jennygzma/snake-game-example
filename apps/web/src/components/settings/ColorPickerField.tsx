import { Box, TextField, InputAdornment } from "@mui/material";

interface ColorPickerFieldProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
  helperText?: string;
}

export const ColorPickerField = ({
  label,
  value,
  onChange,
  disabled = false,
  helperText
}: ColorPickerFieldProps) => {
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      helperText={helperText}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Box
              component="label"
              htmlFor={`color-${label.replace(/\s+/g, "-").toLowerCase()}`}
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                backgroundColor: value,
                border: (theme) => `2px solid ${theme.ui.colorPicker.swatchBorder}`,
                cursor: disabled ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                "&:hover": disabled
                  ? {}
                  : {
                      opacity: 0.8
                    },
                "&:focus-within": {
                  outline: (theme) => `2px solid ${theme.ui.colorPicker.swatchFocusRing}`,
                  outlineOffset: 2
                }
              }}
              aria-label={`${label} color picker`}
            >
              <Box
                component="input"
                type="color"
                id={`color-${label.replace(/\s+/g, "-").toLowerCase()}`}
                value={value}
                onChange={handleColorChange}
                disabled={disabled}
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: disabled ? "not-allowed" : "pointer"
                }}
                aria-label={`Select ${label} color`}
              />
            </Box>
          </InputAdornment>
        )
      }}
      inputProps={{
        "aria-label": `${label} hex value`,
        pattern: "^#[0-9A-Fa-f]{6}$",
        placeholder: "#000000"
      }}
    />
  );
};
