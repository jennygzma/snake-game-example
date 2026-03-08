import { FormControl, MenuItem, Select, Stack, Typography } from "@mui/material";

interface FontPickerProps {
  value: string;
  onChange: (font: string) => void;
}

const AVAILABLE_FONTS = [
  { value: "'Space Grotesk', 'Avenir Next', 'Segoe UI', sans-serif", label: "Space Grotesk (Default)" },
  { value: "'Inter', -apple-system, system-ui, sans-serif", label: "Inter" },
  { value: "'Roboto', 'Helvetica', 'Arial', sans-serif", label: "Roboto" },
  { value: "'Poppins', sans-serif", label: "Poppins" },
  { value: "'Fira Code', 'Courier New', monospace", label: "Fira Code" },
  { value: "Georgia, 'Times New Roman', serif", label: "Georgia" },
  { value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", label: "System Default" }
];

export const FontPicker = ({ value, onChange }: FontPickerProps) => {
  return (
    <Stack spacing={1}>
      <Typography variant="body2" fontWeight={600}>
        Font Family
      </Typography>
      <FormControl size="small" fullWidth>
        <Select value={value} onChange={(e) => onChange(e.target.value)}>
          {AVAILABLE_FONTS.map((font) => (
            <MenuItem key={font.value} value={font.value} sx={{ fontFamily: font.value }}>
              {font.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};