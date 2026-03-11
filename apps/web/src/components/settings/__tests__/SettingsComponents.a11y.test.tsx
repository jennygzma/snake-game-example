import { ThemeProvider } from "@mui/material";
import type { CustomTheme } from "@snake/contracts";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { appTheme } from "../../../theme/theme";
import { ColorPickerField } from "../ColorPickerField";
import { FontPicker } from "../FontPicker";
import { SaveThemeDialog } from "../SaveThemeDialog";
import { ThemeGallery } from "../ThemeGallery";

const now = new Date().toISOString();

const sampleThemes: CustomTheme[] = [
  {
    id: "theme-1",
    userId: "user-1",
    name: "Forest",
    fontFamily: "Space Grotesk",
    colors: {
      bg: "#111417",
      panel: "#1e252b",
      panelBorder: "#2f3a44",
      text: "#f5f7fa",
      textMuted: "#b6c0c9",
      snake: "#8fbc8f",
      snakeHead: "#7ea57e",
      food: "#e07a7a",
      boardGrid: "#2e3944",
      boardBg: "#101418",
      action: "#8fbc8f",
      actionHover: "#7ea57e",
      actionText: "#0b1116",
      pause: "#f0b429",
      pauseHover: "#e2a31f",
      pauseText: "#151515",
      neutral: "#7a8794",
      neutralHover: "#6e7a85",
      neutralText: "#ffffff",
      danger: "#d64545",
      dangerHover: "#be3737",
      dangerText: "#ffffff"
    },
    iconColors: {
      default: "#ffffff"
    },
    createdAt: now,
    updatedAt: now,
    isActive: true
  }
];

describe("Settings components accessibility", () => {
  it("ColorPickerField has no obvious violations", async () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <ColorPickerField label="Snake" value="#8fbc8f" onChange={() => {}} />
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("FontPicker has no obvious violations", async () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <FontPicker value="Space Grotesk" onChange={() => {}} />
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("SaveThemeDialog has no obvious violations", async () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <SaveThemeDialog open initialName="Forest" onClose={() => {}} onSave={async () => {}} />
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("ThemeGallery has no obvious violations", async () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <ThemeGallery
          themes={sampleThemes}
          activeThemeId="theme-1"
          onActivate={async () => {}}
          onEdit={() => {}}
          onDelete={async () => {}}
        />
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
