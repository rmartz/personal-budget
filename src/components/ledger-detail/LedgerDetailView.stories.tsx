import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { BudgetLedgerTransaction } from "@/lib/firebase/schema/budget-ledger-transactions";
import { BudgetLedgerTransactionType } from "@/lib/firebase/schema/budget-ledger-transactions";
import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";
import { LedgerDetailView } from "./LedgerDetailView";

const mockLedger = {
  id: "ledger-1",
  name: "Everyday Spending",
  cashBalance: 3200,
  investmentBalance: 1800,
  cashCap: 5000,
  goalsCount: 2,
};

const mockTransactions: BudgetLedgerTransaction[] = [
  {
    id: "tx-1",
    ledgerId: "ledger-1",
    date: new Date("2026-05-01"),
    description: "Groceries",
    amount: 120,
    type: BudgetLedgerTransactionType.Expense,
  },
  {
    id: "tx-2",
    ledgerId: "ledger-1",
    date: new Date("2026-05-10"),
    description: "Paycheck",
    amount: 3000,
    type: BudgetLedgerTransactionType.Deposit,
  },
];

const mockGoals: BudgetLedgerSavingsGoal[] = [
  {
    id: "goal-1",
    ledgerId: "ledger-1",
    name: "Emergency Fund",
    targetAmount: 10000,
    fundedAmount: 3200,
    priority: 1,
  },
  {
    id: "goal-2",
    ledgerId: "ledger-1",
    name: "Vacation",
    targetAmount: 2000,
    fundedAmount: 500,
    priority: 2,
  },
];

const meta: Meta<typeof LedgerDetailView> = {
  title: "Ledgers/LedgerDetailView",
  component: LedgerDetailView,
  parameters: { layout: "fullscreen" },
  args: {
    ledger: mockLedger,
    transactions: mockTransactions,
    savingsGoals: mockGoals,
    isLoading: false,
    onSaveLedger: () => Promise.resolve(),
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onAddExpense: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onAddDeposit: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onAddGoal: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDeleteTransaction: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onEditTransaction: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDeleteGoal: () => {},
    onEditGoal: () => Promise.resolve(),
    onReorderGoal: () => Promise.resolve(),
  },
};

export default meta;
type Story = StoryObj<typeof LedgerDetailView>;

export const Default: Story = {};

export const NoCashCap: Story = {
  args: {
    ledger: { ...mockLedger, cashCap: undefined },
  },
};

export const EmptyState: Story = {
  args: {
    transactions: [],
    savingsGoals: [],
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
