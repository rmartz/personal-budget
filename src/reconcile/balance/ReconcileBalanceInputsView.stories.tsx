import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";
import { ReconciliationExpenseType } from "@/lib/firebase/schema/reconciliation-expenses";

import { ReconcileBalanceInputsView } from "./ReconcileBalanceInputsView";

const meta: Meta<typeof ReconcileBalanceInputsView> = {
  component: ReconcileBalanceInputsView,
  title: "Reconcile/ReconcileBalanceInputsView",
};

export default meta;
type Story = StoryObj<typeof ReconcileBalanceInputsView>;

const baseProps = {
  accountBalances: {},
  expenseAmounts: {},
  onAccountBalanceChange: () => undefined,
  onExpenseAmountChange: () => undefined,
};

export const EmptyState: Story = {
  args: {
    ...baseProps,
    accounts: [],
    expenses: [],
  },
};

export const AccountsOnly: Story = {
  args: {
    ...baseProps,
    accounts: [
      {
        id: "1",
        name: "Chase Checking",
        tier: ReconciliationAccountTier.ShortTerm,
      },
      {
        id: "2",
        name: "Ally Savings",
        tier: ReconciliationAccountTier.Reserve,
      },
      {
        id: "3",
        name: "Vanguard Brokerage",
        tier: ReconciliationAccountTier.Investment,
      },
    ],
    expenses: [],
  },
};

export const ExpensesOnly: Story = {
  args: {
    ...baseProps,
    accounts: [],
    expenses: [
      {
        id: "1",
        name: "Electric bill",
        type: ReconciliationExpenseType.StatementBalance,
        typicalAmount: 120,
      },
      {
        id: "2",
        name: "Credit card",
        type: ReconciliationExpenseType.RunningBalance,
        typicalAmount: 850,
      },
    ],
  },
};

export const FullyPopulated: Story = {
  args: {
    ...baseProps,
    accounts: [
      {
        id: "1",
        name: "Chase Checking",
        tier: ReconciliationAccountTier.ShortTerm,
      },
      {
        id: "2",
        name: "Ally Savings",
        tier: ReconciliationAccountTier.Reserve,
      },
    ],
    accountBalances: { "1": 4200, "2": 18500 },
    expenses: [
      {
        id: "1",
        name: "Electric bill",
        type: ReconciliationExpenseType.StatementBalance,
        typicalAmount: 120,
      },
      {
        id: "2",
        name: "Credit card",
        type: ReconciliationExpenseType.RunningBalance,
        typicalAmount: 850,
      },
    ],
    expenseAmounts: { "1": 115, "2": 830 },
  },
};
