import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InvestmentLedgerDeleteDialog } from "./InvestmentLedgerDeleteDialog";
import type { InvestmentLedger } from "@/lib/types";

const mockLedger: InvestmentLedger = {
  id: "1",
  name: "Stocks",
  targetAllocationPercent: 70,
  currentBalance: 45000,
};

const meta: Meta<typeof InvestmentLedgerDeleteDialog> = {
  component: InvestmentLedgerDeleteDialog,
  title: "Investments/InvestmentLedgerDeleteDialog",
  args: {
    open: true,
    ledger: mockLedger,
    onOpenChange: (() => undefined) as (open: boolean) => void,
    onConfirm: (() => undefined) as () => void,
  },
};

export default meta;

type Story = StoryObj<typeof InvestmentLedgerDeleteDialog>;

export const Default: Story = {};

export const Pending: Story = {
  args: {
    isPending: true,
  },
};
