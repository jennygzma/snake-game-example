import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from "@mui/material";

const AVAILABLE_FONTS = [
  { value: "'Space Grotesk', 'Avenir Next', 'Segoe UI', sans-serif", label: "Space Grotesk (Default)" },
  { value: "'Inter', 'Helvetica Neue', sans-serif", label: "Inter" },
  { value: "'Roboto', 'Helvetica', 'Arial', sans-serif", label: "Roboto" },
  { value: "'Open Sans', 'Helvetica', 'Arial', sans-serif", label: "Open Sans" },
  { value: "'Lato', 'Helvetica', 'Arial', sans-serif", label: "Lato" },
  { value: "'Poppins', 'Helvetica', 'Arial', sans-serif", label: "Poppins" },
  { value: "'Montserrat', 'Helvetica', 'Arial', sans-serif", label: "Montserrat" },
  { value: "'Arial', 'Helvetica', sans-serif", label: "Arial" },
  { value: "'Helvetica', 'Arial', sans-serif", label: "Helvetica" },
  { value: "'Times New Roman', 'Times', serif", label: "Times New Roman" },
  { value: "'Georgia', serif", label: "Georgia" },
  { value: "'Courier New', 'Courier', monospace", label: "Courier New" }
];

type FontPickerProps = {
  value: string;
  onChange: (fontFamily: string) => void;
  label?: string;
};

export const FontPicker = ({ value, onChange, label = "Font Family" }: FontPickerProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="font-picker-label">{label}</InputLabel>
      <Select
        labelId="font-picker-label"
        value={value}
        label={label}
        onChange={handleChange}
      >
        {AVAILABLE_FONTS.map((font) => (
          <MenuItem key={font.value} value={font.value} sx={{ fontFamily: font.value }}>
            {font.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};