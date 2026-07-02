import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ReportsView } from "./ReportsView";

const meta: Meta<typeof ReportsView> = {
  component: ReportsView,
  title: "Reports/ReportsView",
  parameters: {
    layout: "fullscreen",
  },
  args: {
    onPeriodChange: () => {
      // Static story — no state wiring needed.
    },
  },
};

export default meta;
type Story = StoryObj<typeof ReportsView>;

export const Default: Story = {
  args: { period: "6m" },
};

export const AllTime: Story = {
  args: { period: "all" },
};
