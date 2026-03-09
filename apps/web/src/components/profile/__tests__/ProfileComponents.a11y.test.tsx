import { ThemeProvider } from "@mui/material";
import type { Profile } from "@snake/contracts";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { appTheme } from "../../../theme/theme";
import { CreateProfileDialog } from "../CreateProfileDialog";
import { DeleteProfileDialog } from "../DeleteProfileDialog";
import { ProfileCard } from "../ProfileCard";
import { ProfilePicker } from "../ProfilePicker";

const profile: Profile = {
  id: "profile-1",
  name: "Jenny",
  avatarBase64: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true
};

describe("Profile components accessibility", () => {
  it("ProfileCard has no obvious violations", async () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <ProfileCard profile={profile} onSelect={() => {}} />
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("CreateProfileDialog has no obvious violations", async () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <CreateProfileDialog open onClose={() => {}} onCreate={async () => {}} />
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("DeleteProfileDialog has no obvious violations", async () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <DeleteProfileDialog open profile={profile} onClose={() => {}} onDelete={async () => {}} />
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("ProfilePicker has no obvious violations", async () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <ProfilePicker
          profiles={[profile]}
          onSelectProfile={() => {}}
          onCreateProfile={async () => {}}
        />
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
