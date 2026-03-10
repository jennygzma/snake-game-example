import { useState } from "react";
import { ThemeProvider } from "@mui/material";
import type { Profile } from "@snake/contracts";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("CreateProfileDialog exposes dialog semantics and restores focus on close", async () => {
    const user = userEvent.setup();

    const DialogHarness = () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open create dialog
          </button>
          <CreateProfileDialog
            open={open}
            onClose={() => setOpen(false)}
            onCreate={async () => {}}
          />
        </>
      );
    };

    render(
      <ThemeProvider theme={appTheme}>
        <DialogHarness />
      </ThemeProvider>
    );

    const trigger = screen.getByRole("button", { name: "Open create dialog" });
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog", { name: "Create Profile" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "create-profile-dialog-title");
    expect(dialog).toHaveAttribute("aria-describedby", "create-profile-dialog-description");
    expect(screen.getByText("Create a new profile name and optional avatar.")).toHaveAttribute(
      "id",
      "create-profile-dialog-description"
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Profile Name")).toHaveFocus();
    });

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
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
