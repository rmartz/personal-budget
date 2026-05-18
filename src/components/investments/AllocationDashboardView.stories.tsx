import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AllocationDashboardView } from "./AllocationDashboardView";

const meta: Meta<typeof AllocationDashboardView> = {
  component: AllocationDashboardView,
  title: "Investments/AllocationDashboardView",
};

export default meta;
type Story = StoryObj<typeof AllocationDashboardView>;

export const Empty: Story = {
  args: {
    accounts: [],
  },
};

export const AllAtTarget: Story = {
  args: {
    accounts: [
      {
        id: "acc-stocks",
        name: "Stocks",
        currentPercent: 60,
        targetPercent: 60,
      },
      { id: "acc-bonds", name: "Bonds", currentPercent: 30, targetPercent: 30 },
      {
        id: "acc-intl",
        name: "International",
        currentPercent: 10,
        targetPercent: 10,
      },
    ],
  },
};

export const WithDeviations: Story = {
  args: {
    accounts: [
      {
        id: "acc-stocks",
        name: "Stocks",
        currentPercent: 65,
        targetPercent: 60,
      },
      { id: "acc-bonds", name: "Bonds", currentPercent: 25, targetPercent: 30 },
      {
        id: "acc-intl",
        name: "International",
        currentPercent: 10,
        targetPercent: 10,
      },
    ],
  },
};
