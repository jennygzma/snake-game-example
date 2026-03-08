import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from "@mui/material";

const FONT_OPTIONS = [
  { value: "'Space Grotesk', 'Avenir Next', 'Segoe UI', sans-serif", label: "Space Grotesk (Default)" },
  { value: "'Arial', sans-serif", label: "Arial" },
  { value: "'Helvetica Neue', 'Helvetica', sans-serif", label: "Helvetica" },
  { value: "'Georgia', serif", label: "Georgia" },
  { value: "'Times New Roman', serif", label: "Times New Roman" },
  { value: "'Courier New', monospace", label: "Courier New" },
  { value: "'Verdana', sans-serif", label: "Verdana" },
  { value: "'Roboto', sans-serif", label: "Roboto" },
  { value: "'Open Sans', sans-serif", label: "Open Sans" }
] as const;

type FontPickerProps = {
  value: string;
  onChange: (font: string) => void;
};

export const FontPicker = ({ value, onChange }: FontPickerProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="font-picker-label">Font Family</InputLabel>
      <Select
        labelId="font-picker-label"
        id="font-picker"
        value={value}
        label="Font Family"
        onChange={handleChange}
      >
        {FONT_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value} sx={{ fontFamily: option.value }}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};