import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CreateAccountDialogView } from "./CreateAccountDialog";
import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";

const meta: Meta<typeof CreateAccountDialogView> = {
  component: CreateAccountDialogView,
  title: "Accounts/CreateAccountDialog",
  args: {
    open: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpenChange: () => {},
    name: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onNameChange: () => {},
    accountType: undefined,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onAccountTypeChange: () => {},
    targetFloat: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onTargetFloatChange: () => {},
    nameError: undefined,
    accountTypeError: undefined,
    targetFloatError: undefined,
    submitError: undefined,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => {},
    isSubmitting: false,
  },
};

export default meta;
type Story = StoryObj<typeof CreateAccountDialogView>;

export const EmptyForm: Story = {};

export const ShortTermForm: Story = {
  args: {
    name: "Chase Checking",
    accountType: ReconciliationAccountTier.ShortTerm,
    targetFloat: "2000",
  },
};

export const ReserveForm: Story = {
  args: {
    name: "High-Yield Savings",
    accountType: ReconciliationAccountTier.Reserve,
    targetFloat: "10000",
  },
};

export const LongTermForm: Story = {
  args: {
    name: "Money Market",
    accountType: ReconciliationAccountTier.LongTerm,
    targetFloat: "50000",
  },
};

export const InvestmentForm: Story = {
  args: {
    name: "Vanguard Brokerage",
    accountType: ReconciliationAccountTier.Investment,
  },
};

export const ValidationErrors: Story = {
  args: {
    nameError: "Name is required.",
    accountTypeError: "Account type is required.",
  },
};

export const TargetFloatError: Story = {
  args: {
    name: "Checking",
    accountType: ReconciliationAccountTier.ShortTerm,
    targetFloatError: "Target float is required.",
  },
};

export const SubmitError: Story = {
  args: {
    name: "Chase Checking",
    accountType: ReconciliationAccountTier.ShortTerm,
    targetFloat: "2000",
    submitError: "Failed to add account. Please try again.",
  },
};

export const Submitting: Story = {
  args: {
    name: "Vanguard Brokerage",
    accountType: ReconciliationAccountTier.Investment,
    isSubmitting: true,
  },
};
