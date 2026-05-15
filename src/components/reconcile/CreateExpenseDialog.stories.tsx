import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ReconciliationExpenseType } from "@/lib/firebase/schema/reconciliation-expenses";

import { CreateExpenseDialogView } from "./CreateExpenseDialog";

const meta: Meta<typeof CreateExpenseDialogView> = {
  component: CreateExpenseDialogView,
  title: "Reconcile/CreateExpenseDialog",
};

export default meta;
type Story = StoryObj<typeof CreateExpenseDialogView>;

const baseProps = {
  open: true,
  onOpenChange: () => undefined,
  name: "",
  onNameChange: () => undefined,
  typicalAmount: "",
  onTypicalAmountChange: () => undefined,
  nameError: undefined,
  typicalAmountError: undefined,
  submitError: undefined,
  onSubmit: () => undefined,
  isSubmitting: false,
};

export const StatementType: Story = {
  args: {
    ...baseProps,
    type: ReconciliationExpenseType.StatementBalance,
    onTypeChange: () => undefined,
  },
};

export const RunningBalanceType: Story = {
  args: {
    ...baseProps,
    type: ReconciliationExpenseType.RunningBalance,
    onTypeChange: () => undefined,
  },
};

export const WithValidationErrors: Story = {
  args: {
    ...baseProps,
    type: ReconciliationExpenseType.StatementBalance,
    onTypeChange: () => undefined,
    nameError: "Name is required.",
    typicalAmountError: "Monthly amount must be a positive number.",
  },
};

export const Submitting: Story = {
  args: {
    ...baseProps,
    type: ReconciliationExpenseType.StatementBalance,
    onTypeChange: () => undefined,
    name: "Credit card",
    typicalAmount: "450",
    isSubmitting: true,
  },
};
