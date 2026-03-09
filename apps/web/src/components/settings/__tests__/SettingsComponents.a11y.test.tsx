import { render } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material";
import { axe, toHaveNoViolations } from "jest-axe";
import { SaveThemeDialog } from "../SaveThemeDialog";
import { ColorPickerField } from "../ColorPickerField";
import { FontPicker } from "../FontPicker";

expect.extend(toHaveNoViolations);

const theme = createTheme();

describe("Settings Components Accessibility", () => {
  it("SaveThemeDialog should have no accessibility violations when open", async () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <SaveThemeDialog open={true} onSave={() => {}} onCancel={() => {}} />
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("ColorPickerField should have no accessibility violations", async () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <ColorPickerField label="Test Color" value="#87ae73" onChange={() => {}} />
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("FontPicker should have no accessibility violations", async () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <FontPicker value="'Arial', sans-serif" onChange={() => {}} />
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});