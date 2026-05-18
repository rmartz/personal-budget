import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MonthlyAggregationSummaryView } from "./MonthlyAggregationSummaryView";

const meta: Meta<typeof MonthlyAggregationSummaryView> = {
  component: MonthlyAggregationSummaryView,
  title: "Investments/MonthlyAggregationSummaryView",
};

export default meta;
type Story = StoryObj<typeof MonthlyAggregationSummaryView>;

export const Empty: Story = {
  args: {
    rows: [],
    totalLedgerCount: 0,
  },
};

export const WithRows: Story = {
  args: {
    rows: [
      {
        cashBalance: 4200,
        investmentBalance: 12000,
        ledgerName: "Primary",
        netBuySell: 800,
      },
      {
        cashBalance: 1600,
        investmentBalance: 8400,
        ledgerName: "Travel Fund",
        netBuySell: -360,
      },
      {
        cashBalance: 900,
        investmentBalance: 3500,
        ledgerName: "Emergency",
        netBuySell: 0,
      },
    ],
    totalLedgerCount: 14,
  },
};
