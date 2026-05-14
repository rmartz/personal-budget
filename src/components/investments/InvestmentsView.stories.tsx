import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Posture } from "@/lib/firebase/schema/investments";

import { InvestmentsView } from "./InvestmentsView";

const meta: Meta<typeof InvestmentsView> = {
  component: InvestmentsView,
  title: "Investments/InvestmentsView",
};

export default meta;
type Story = StoryObj<typeof InvestmentsView>;

export const Loading: Story = {
  args: {
    accounts: [],
    allocation: [],
    posture: Posture.Balanced,
    isLoading: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onApplyRebalance: () => {},
  },
};

export const Empty: Story = {
  args: {
    accounts: [],
    allocation: [],
    posture: Posture.Balanced,
    isLoading: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onApplyRebalance: () => {},
  },
};

export const WithAccounts: Story = {
  args: {
    accounts: [
      {
        id: "a1",
        name: "US Stocks (VTI)",
        currentPercent: 55,
        targetPercent: 60,
      },
      {
        id: "a2",
        name: "Intl Stocks (VXUS)",
        currentPercent: 25,
        targetPercent: 25,
      },
      { id: "a3", name: "Bonds (BND)", currentPercent: 20, targetPercent: 15 },
    ],
    allocation: [
      {
        accountId: "a1",
        accountName: "US Stocks (VTI)",
        action: "buy",
        amount: 2400,
      },
      {
        accountId: "a2",
        accountName: "Intl Stocks (VXUS)",
        action: "hold",
        amount: 0,
      },
      {
        accountId: "a3",
        accountName: "Bonds (BND)",
        action: "sell",
        amount: 360,
      },
    ],
    posture: Posture.Aggressive,
    isLoading: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onApplyRebalance: () => {},
  },
};
