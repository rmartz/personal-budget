import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";

import { EditAccountDialogView } from "./EditAccountDialog";

const meta: Meta<typeof EditAccountDialogView> = {
  component: EditAccountDialogView,
  title: "Reconcile/EditAccountDialog",
};

export default meta;
type Story = StoryObj<typeof EditAccountDialogView>;

const baseProps = {
  isSubmitting: false,
  name: "Chase Checking",
  nameError: undefined,
  onNameChange: () => undefined,
  onOpenChange: () => undefined,
  onSubmit: () => undefined,
  onTargetFloatChange: () => undefined,
  open: true,
  submitError: undefined,
  targetFloat: "2000",
  targetFloatError: undefined,
};

export const CashAccount: Story = {
  args: {
    ...baseProps,
    tier: ReconciliationAccountTier.ShortTerm,
  },
};

export const InvestmentAccount: Story = {
  args: {
    ...baseProps,
    tier: ReconciliationAccountTier.Investment,
    targetFloat: "",
  },
};

export const WithValidationErrors: Story = {
  args: {
    ...baseProps,
    tier: ReconciliationAccountTier.ShortTerm,
    nameError: "Name is required.",
    targetFloatError: "Target float must be a positive number.",
  },
};

export const Saving: Story = {
  args: {
    ...baseProps,
    tier: ReconciliationAccountTier.ShortTerm,
    isSubmitting: true,
  },
};
