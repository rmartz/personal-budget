import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { NewAnnuityDialogView } from "./NewAnnuityDialog";

const meta: Meta<typeof NewAnnuityDialogView> = {
  component: NewAnnuityDialogView,
  title: "Annuities/NewAnnuityDialog",
};

export default meta;
type Story = StoryObj<typeof NewAnnuityDialogView>;

export const Empty: Story = {
  args: {
    open: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpenChange: () => {},
    name: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onNameChange: () => {},
    monthlyAmount: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onMonthlyAmountChange: () => {},
    durationMonths: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDurationMonthsChange: () => {},
    nameError: undefined,
    monthlyAmountError: undefined,
    submitError: undefined,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => {},
    isSubmitting: false,
  },
};

export const WithValidationErrors: Story = {
  args: {
    open: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpenChange: () => {},
    name: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onNameChange: () => {},
    monthlyAmount: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onMonthlyAmountChange: () => {},
    durationMonths: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDurationMonthsChange: () => {},
    nameError: "Name is required.",
    monthlyAmountError: "Monthly amount is required.",
    submitError: undefined,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => {},
    isSubmitting: false,
  },
};

export const Filled: Story = {
  args: {
    open: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpenChange: () => {},
    name: "Car Loan",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onNameChange: () => {},
    monthlyAmount: "425.50",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onMonthlyAmountChange: () => {},
    durationMonths: "48",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDurationMonthsChange: () => {},
    nameError: undefined,
    monthlyAmountError: undefined,
    submitError: undefined,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => {},
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    open: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpenChange: () => {},
    name: "Netflix",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onNameChange: () => {},
    monthlyAmount: "15.99",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onMonthlyAmountChange: () => {},
    durationMonths: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDurationMonthsChange: () => {},
    nameError: undefined,
    monthlyAmountError: undefined,
    submitError: undefined,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => {},
    isSubmitting: true,
  },
};

export const WithSubmitError: Story = {
  args: {
    open: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpenChange: () => {},
    name: "Netflix",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onNameChange: () => {},
    monthlyAmount: "15.99",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onMonthlyAmountChange: () => {},
    durationMonths: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDurationMonthsChange: () => {},
    nameError: undefined,
    monthlyAmountError: undefined,
    submitError: "Something went wrong. Please try again.",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => {},
    isSubmitting: false,
  },
};
