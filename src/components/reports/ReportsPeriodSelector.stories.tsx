import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ReportsPeriodSelector } from "./ReportsPeriodSelector";

const meta: Meta<typeof ReportsPeriodSelector> = {
  component: ReportsPeriodSelector,
  title: "Reports/ReportsPeriodSelector",
  args: {
    onValueChange: () => {
      // Static story — no state wiring needed.
    },
  },
};

export default meta;
type Story = StoryObj<typeof ReportsPeriodSelector>;

export const SixMonths: Story = {
  args: { value: "6m" },
};

export const AllTime: Story = {
  args: { value: "all" },
};
