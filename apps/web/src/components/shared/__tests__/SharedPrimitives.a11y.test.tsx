import { ThemeProvider } from "@mui/material";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { approvedIcons } from "../../../theme/approvedIcons";
import { appTheme } from "../../../theme/theme";
import { AppButton } from "../AppButton";
import { NavIconButton } from "../NavIconButton";
import { PageLayout } from "../PageLayout";

describe("Shared primitive accessibility", () => {
  it("AppButton has no obvious violations", async () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <AppButton tone="primary">Save</AppButton>
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("NavIconButton has no obvious violations", async () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <NavIconButton label="Game" onClick={() => {}} icon={<approvedIcons.sportsEsports />} />
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("PageLayout has no obvious violations", async () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <PageLayout maxWidth="md" spacing={2}>
          <h1>Heading</h1>
          <p>Content</p>
        </PageLayout>
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
