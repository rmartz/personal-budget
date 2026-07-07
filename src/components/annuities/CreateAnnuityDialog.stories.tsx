import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CreateAnnuityDialogView } from "./CreateAnnuityDialogView";
import { AnnuityMode } from "./types";

const meta: Meta<typeof CreateAnnuityDialogView> = {
  component: CreateAnnuityDialogView,
  title: "Annuities/CreateAnnuityDialog",
  args: {
    open: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpenChange: () => {},
    mode: AnnuityMode.Flat,
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
    mode: AnnuityMode.Flat,
    nameError: "Name is required.",
    monthlyAmountError: "Monthly amount must be a positive number.",
  },
};

export const LoanModeEmpty: Story = {
  args: {
    mode: AnnuityMode.PV,
  },
};

export const LoanModeWithPreview: Story = {
  args: {
    mode: AnnuityMode.PV,
    name: "Car Loan",
    presentValue: "10000",
    annualRate: "5",
    durationMonths: "12",
    monthlyPreview: 856.07,
  },
};

export const LoanModeValidationErrors: Story = {
  args: {
    mode: AnnuityMode.PV,
    presentValueError: "Starting value must be a positive number.",
    annualRateError: "Annual rate must be a positive number.",
    durationMonthsError: "Duration must be a positive whole number.",
  },
};

export const Submitting: Story = {
  args: {
    mode: AnnuityMode.Flat,
    name: "Netflix",
    monthlyAmount: "15.99",
    isSubmitting: true,
  },
};

export const SubmitError: Story = {
  args: {
    mode: AnnuityMode.Flat,
    name: "Netflix",
    monthlyAmount: "15.99",
    submitError: "Failed to create annuity. Please try again.",
  },
};
