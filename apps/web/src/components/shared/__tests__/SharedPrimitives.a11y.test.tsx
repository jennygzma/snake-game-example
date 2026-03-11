import { ThemeProvider } from "@mui/material";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { approvedIcons } from "../../../theme/approvedIcons";
import { appTheme } from "../../../theme/theme";
import { AppButton } from "../AppButton";
import { AppDialogShell } from "../AppDialogShell";
import { IconActionButton } from "../IconActionButton";
import { NavIconButton } from "../NavIconButton";
import { PageLayout } from "../PageLayout";
import { ProfileAvatar } from "../ProfileAvatar";

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

  it("IconActionButton has no obvious violations", async () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <IconActionButton label="Save" icon={<approvedIcons.check />} onClick={() => {}} />
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("ProfileAvatar has no obvious violations", async () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <ProfileAvatar src={null} alt="Player avatar" />
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("AppDialogShell has no obvious violations", async () => {
    const { baseElement } = render(
      <ThemeProvider theme={appTheme}>
        <AppDialogShell
          open
          title="Confirm action"
          titleId="shared-dialog-title"
          description="This action cannot be undone."
          descriptionId="shared-dialog-description"
          actions={<AppButton tone="primary">Confirm</AppButton>}
        />
      </ThemeProvider>
    );

    const results = await axe(baseElement);
    expect(results.violations).toHaveLength(0);
  });
});
