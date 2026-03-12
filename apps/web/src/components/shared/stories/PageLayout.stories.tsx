import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "@mui/material";
import { PageLayout } from "../PageLayout";

const meta = {
  title: "Shared/PageLayout",
  component: PageLayout
} satisfies Meta<typeof PageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <PageLayout maxWidth="md" spacing={2}>
      <Typography variant="h4">Page Title</Typography>
      <Typography color="text.secondary">
        Reusable page wrapper with consistent container width, vertical padding, and stack spacing.
      </Typography>
    </PageLayout>
  )
};

export const Accessibility: Story = {
  render: () => (
    <PageLayout maxWidth="md" spacing={2}>
      <Typography component="h1" variant="h4">
        Accessibility Check
      </Typography>
      <Typography component="p" color="text.secondary">
        This story is intended for Storybook a11y addon verification of heading and content structure.
      </Typography>
      <Typography component="p">
        Use the a11y panel to confirm no violations for the page wrapper baseline.
      </Typography>
    </PageLayout>
  )
};
