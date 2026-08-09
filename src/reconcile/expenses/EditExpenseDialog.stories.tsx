import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ReconciliationExpenseType } from "@/lib/firebase/schema/reconciliation-expenses";

import { EditExpenseDialogView } from "./EditExpenseDialog";

const meta: Meta<typeof EditExpenseDialogView> = {
  component: EditExpenseDialogView,
  title: "Reconcile/EditExpenseDialog",
};

export default meta;
type Story = StoryObj<typeof EditExpenseDialogView>;

const baseProps = {
  isSubmitting: false,
  name: "Electric bill",
  nameError: undefined,
  onNameChange: () => undefined,
  onOpenChange: () => undefined,
  onSubmit: () => undefined,
  onTypeChange: () => undefined,
  onTypicalAmountChange: () => undefined,
  open: true,
  submitError: undefined,
  type: ReconciliationExpenseType.StatementBalance,
  typicalAmount: "120",
  typicalAmountError: undefined,
};

export const StatementType: Story = {
  args: baseProps,
};

export const RunningBalanceType: Story = {
  args: {
    ...baseProps,
    type: ReconciliationExpenseType.RunningBalance,
  },
};

export const WithValidationErrors: Story = {
  args: {
    ...baseProps,
    nameError: "Name is required.",
    typicalAmountError: "Monthly amount must be a positive number.",
  },
};

export const Saving: Story = {
  args: {
    ...baseProps,
    isSubmitting: true,
  },
};
