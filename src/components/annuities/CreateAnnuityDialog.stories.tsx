import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CreateAnnuityDialogView } from "./CreateAnnuityDialog";

const meta: Meta<typeof CreateAnnuityDialogView> = {
  component: CreateAnnuityDialogView,
  title: "Annuities/CreateAnnuityDialog",
  args: {
    open: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpenChange: () => {},
    mode: "flat",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onModeChange: () => {},
    name: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onNameChange: () => {},
    monthlyAmount: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onMonthlyAmountChange: () => {},
    presentValue: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onPresentValueChange: () => {},
    annualRate: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onAnnualRateChange: () => {},
    durationMonths: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDurationMonthsChange: () => {},
    monthlyPreview: undefined,
    nameError: undefined,
    monthlyAmountError: undefined,
    presentValueError: undefined,
    annualRateError: undefined,
    durationMonthsError: undefined,
    submitError: undefined,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => {},
    isSubmitting: false,
  },
};

export default meta;
type Story = StoryObj<typeof CreateAnnuityDialogView>;

export const FlatModeEmpty: Story = {};

export const FlatModeValidationErrors: Story = {
  args: {
    mode: "flat",
    nameError: "Name is required.",
    monthlyAmountError: "Monthly amount must be a positive number.",
  },
};

export const LoanModeEmpty: Story = {
  args: {
    mode: "pv",
  },
};

export const LoanModeWithPreview: Story = {
  args: {
    mode: "pv",
    name: "Car Loan",
    presentValue: "10000",
    annualRate: "5",
    durationMonths: "12",
    monthlyPreview: 856.07,
  },
};

export const LoanModeValidationErrors: Story = {
  args: {
    mode: "pv",
    presentValueError: "Starting value must be a positive number.",
    annualRateError: "Annual rate must be a positive number.",
    durationMonthsError: "Duration must be a positive whole number.",
  },
};

export const Submitting: Story = {
  args: {
    mode: "flat",
    name: "Netflix",
    monthlyAmount: "15.99",
    isSubmitting: true,
  },
};

export const SubmitError: Story = {
  args: {
    mode: "flat",
    name: "Netflix",
    monthlyAmount: "15.99",
    submitError: "Failed to create annuity. Please try again.",
  },
};
