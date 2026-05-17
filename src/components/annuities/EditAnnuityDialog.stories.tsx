import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { EDIT_ANNUITY_DIALOG_COPY } from "./copy";
import { EditAnnuityDialogView } from "./EditAnnuityDialogView";

const meta: Meta<typeof EditAnnuityDialogView> = {
  component: EditAnnuityDialogView,
  title: "Annuities/EditAnnuityDialog",
  args: {
    open: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpenChange: () => {},
    name: "Car Loan",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onNameChange: () => {},
    monthlyAmount: "250",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onMonthlyAmountChange: () => {},
    nameError: undefined,
    monthlyAmountError: undefined,
    submitError: undefined,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => {},
    isSubmitting: false,
  },
};

export default meta;
type Story = StoryObj<typeof EditAnnuityDialogView>;

export const Default: Story = {};

export const ValidationErrors: Story = {
  args: {
    nameError: EDIT_ANNUITY_DIALOG_COPY.nameRequiredError,
    monthlyAmountError: EDIT_ANNUITY_DIALOG_COPY.monthlyAmountInvalidError,
  },
};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};

export const SubmitError: Story = {
  args: {
    submitError: EDIT_ANNUITY_DIALOG_COPY.submitError,
  },
};
