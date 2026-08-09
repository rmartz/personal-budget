import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";
import { ReconciliationExpenseType } from "@/lib/firebase/schema/reconciliation-expenses";

import { ReconcileSetupView } from "./ReconcileSetupView";

const meta: Meta<typeof ReconcileSetupView> = {
  component: ReconcileSetupView,
  title: "Reconcile/ReconcileSetupView",
};

export default meta;
type Story = StoryObj<typeof ReconcileSetupView>;

const baseProps = {
  onDeleteAccount: () => undefined,
  onDeleteExpense: () => undefined,
  onEditAccount: () => undefined,
  onEditExpense: () => undefined,
};

export const EmptyState: Story = {
  args: {
    ...baseProps,
    accounts: [],
    expenses: [],
  },
};

export const PopulatedAccounts: Story = {
  args: {
    ...baseProps,
    accounts: [
      {
        id: "1",
        name: "Chase Checking",
        tier: ReconciliationAccountTier.ShortTerm,
        targetFloat: 2000,
      },
      {
        id: "2",
        name: "Ally Savings",
        tier: ReconciliationAccountTier.Reserve,
        targetFloat: 10000,
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

export const PopulatedExpenses: Story = {
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
      {
        id: "3",
        name: "Internet",
        type: ReconciliationExpenseType.StatementBalance,
        typicalAmount: 70,
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
        targetFloat: 2000,
      },
      {
        id: "2",
        name: "Ally Savings",
        tier: ReconciliationAccountTier.Reserve,
        targetFloat: 10000,
      },
      {
        id: "3",
        name: "Vanguard Brokerage",
        tier: ReconciliationAccountTier.Investment,
      },
    ],
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
