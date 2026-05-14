import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BudgetLedgerTransactionType } from "@/lib/firebase/schema/budget-ledger-transactions";

import { LedgerTransactionListView } from "./LedgerTransactionList";

const meta: Meta<typeof LedgerTransactionListView> = {
  component: LedgerTransactionListView,
  title: "Ledgers/LedgerTransactionList",
  args: {
    ledgerName: "Everyday Spending",
    onAddExpense: () => undefined,
    onDeleteTransaction: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof LedgerTransactionListView>;

export const Empty: Story = {
  args: {
    transactions: [],
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    transactions: [],
    isLoading: true,
  },
};

export const Populated: Story = {
  args: {
    isLoading: false,
    transactions: [
      {
        id: "tx-1",
        ledgerId: "ledger-1",
        type: BudgetLedgerTransactionType.Deposit,
        date: new Date("2024-01-01T00:00:00.000Z"),
        amount: 2500,
        description: "January paycheck",
      },
      {
        id: "tx-2",
        ledgerId: "ledger-1",
        type: BudgetLedgerTransactionType.Expense,
        date: new Date("2024-01-05T00:00:00.000Z"),
        amount: 120.5,
        description: "Grocery run",
      },
      {
        id: "tx-3",
        ledgerId: "ledger-1",
        type: BudgetLedgerTransactionType.Expense,
        date: new Date("2024-01-10T00:00:00.000Z"),
        amount: 850,
        description: "Rent",
      },
      {
        id: "tx-4",
        ledgerId: "ledger-1",
        type: BudgetLedgerTransactionType.Deposit,
        date: new Date("2024-01-15T00:00:00.000Z"),
        amount: 200,
        description: "Side project income",
      },
    ],
  },
};
