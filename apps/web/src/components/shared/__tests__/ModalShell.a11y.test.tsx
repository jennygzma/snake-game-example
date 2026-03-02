import { ThemeProvider, Typography } from "@mui/material";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { appTheme } from "../../../theme/theme";
import { ModalShell } from "../ModalShell";

describe("ModalShell accessibility", () => {
  it("has no obvious violations with labelled dialog", async () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <ModalShell open ariaLabelledBy="dialog-title" ariaDescribedBy="dialog-description">
          <Typography id="dialog-title" variant="h6">
            Game Over
          </Typography>
          <Typography id="dialog-description">Your score: 12</Typography>
        </ModalShell>
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
