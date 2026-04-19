import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InvestmentLedgerList } from "./InvestmentLedgerList";
import type { InvestmentLedger } from "@/lib/types";

const mockLedgers: InvestmentLedger[] = [
  {
    id: "1",
    name: "Stocks",
    targetAllocationPercent: 70,
    currentBalance: 45000,
  },
  {
    id: "2",
    name: "Bonds",
    targetAllocationPercent: 20,
    currentBalance: 12500,
  },
  {
    id: "3",
    name: "Real Estate",
    targetAllocationPercent: undefined,
    currentBalance: 8750,
  },
];

const meta: Meta<typeof InvestmentLedgerList> = {
  component: InvestmentLedgerList,
  title: "Investments/InvestmentLedgerList",
  args: {
    onNewLedger: (() => undefined) as () => void,
  },
};

export default meta;

type Story = StoryObj<typeof InvestmentLedgerList>;

export const Empty: Story = {
  args: {
    ledgers: [],
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    ledgers: [],
    isLoading: true,
  },
};

export const Populated: Story = {
  args: {
    ledgers: mockLedgers,
    isLoading: false,
  },
};
