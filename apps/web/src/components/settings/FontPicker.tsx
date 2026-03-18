import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";

interface FontPickerProps {
  value: string;
  onChange: (fontFamily: string) => void;
  disabled?: boolean;
}

const AVAILABLE_FONTS = [
  { value: "Arial", label: "Arial" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
  { value: "Verdana", label: "Verdana" },
  { value: "Georgia", label: "Georgia" },
  { value: "Palatino", label: "Palatino" },
  { value: "Garamond", label: "Garamond" },
  { value: "Comic Sans MS", label: "Comic Sans MS" },
  { value: "Trebuchet MS", label: "Trebuchet MS" },
  { value: "Impact", label: "Impact" },
  { value: "Space Grotesk", label: "Space Grotesk" },
  { value: "Avenir Next", label: "Avenir Next" },
  { value: "Segoe UI", label: "Segoe UI" }
];

export const FontPicker = ({ value, onChange, disabled = false }: FontPickerProps) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel id="font-picker-label">Font Family</InputLabel>
      <Select
        labelId="font-picker-label"
        id="font-picker"
        value={value}
        label="Font Family"
        onChange={handleChange}
        inputProps={{
          "aria-label": "Select font family"
        }}
      >
        {AVAILABLE_FONTS.map((font) => (
          <MenuItem
            key={font.value}
            value={font.value}
            sx={{ fontFamily: font.value }}
          >
            {font.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};