import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import { ThemeProvider } from "@mui/material";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { appTheme } from "../../../theme/theme";
import { ActionButton } from "../ActionButton";

describe("ActionButton accessibility", () => {
  it("has no obvious violations in default mode", async () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <ActionButton tone="play">Start</ActionButton>
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("has no obvious violations in icon-only mode", async () => {
    window.matchMedia = (() => ({
      matches: true,
      media: "(max-width: 600px)",
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false
    })) as typeof window.matchMedia;

    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <ActionButton
          tone="play"
          icon={<PlayArrowRounded />}
          responsiveIconOnly
          aria-label="Start"
        >
          Start
        </ActionButton>
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
