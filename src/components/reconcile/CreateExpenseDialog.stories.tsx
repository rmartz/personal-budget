import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ReconciliationExpenseType } from "@/lib/firebase/schema/reconciliation-expenses";

import { CREATE_EXPENSE_DIALOG_COPY } from "./CreateExpenseDialog.copy";
import { CreateExpenseDialogView } from "./CreateExpenseDialogView";

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
    nameError: CREATE_EXPENSE_DIALOG_COPY.nameRequiredError,
    typicalAmountError: CREATE_EXPENSE_DIALOG_COPY.amountInvalidError,
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
