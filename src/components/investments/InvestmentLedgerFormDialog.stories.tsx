import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InvestmentLedgerFormDialog } from "./InvestmentLedgerFormDialog";
import type { InvestmentLedger } from "@/lib/types";

const mockLedger: InvestmentLedger = {
  id: "1",
  name: "Stocks",
  targetAllocationPercent: 70,
  currentBalance: 45000,
};

const meta: Meta<typeof InvestmentLedgerFormDialog> = {
  component: InvestmentLedgerFormDialog,
  title: "Investments/InvestmentLedgerFormDialog",
  args: {
    open: true,
    onOpenChange: (() => undefined) as (open: boolean) => void,
    onSubmit: (() => undefined) as (data: { name: string }) => void,
  },
};

export default meta;

type Story = StoryObj<typeof InvestmentLedgerFormDialog>;

export const Create: Story = {
  args: {
    ledger: undefined,
  },
};

export const Edit: Story = {
  args: {
    ledger: mockLedger,
  },
};

export const Pending: Story = {
  args: {
    ledger: undefined,
    isPending: true,
  },
};
