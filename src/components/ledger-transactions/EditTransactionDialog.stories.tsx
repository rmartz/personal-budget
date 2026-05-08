import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BudgetLedgerTransactionType } from "@/lib/firebase/schema/budget-ledger-transactions";
import { EditTransactionDialog } from "./EditTransactionDialog";

const meta: Meta<typeof EditTransactionDialog> = {
  component: EditTransactionDialog,
  title: "Ledgers/EditTransactionDialog",
  args: {
    open: true,
    isSubmitting: false,
    onOpenChange: () => undefined,
    onSubmit: () => Promise.resolve(),
    initialDate: new Date("2024-03-15T00:00:00"),
    initialAmount: 42.5,
    initialDescription: "Coffee",
    transactionType: BudgetLedgerTransactionType.Expense,
  },
};

export default meta;
type Story = StoryObj<typeof EditTransactionDialog>;

export const Default: Story = {};

export const Deposit: Story = {
  args: {
    initialAmount: 1000,
    initialDescription: "Paycheck",
    transactionType: BudgetLedgerTransactionType.Deposit,
  },
};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};

export const SubmitError: Story = {
  args: {
    onSubmit: () => Promise.reject(new Error("Firebase error")),
  },
};
