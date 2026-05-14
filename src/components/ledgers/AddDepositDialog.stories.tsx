import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AddDepositDialogView } from "./AddDepositDialog";
import { ADD_DEPOSIT_DIALOG_COPY } from "./AddDepositDialog.copy";

const today = new Date().toISOString().slice(0, 10);

const meta: Meta<typeof AddDepositDialogView> = {
  component: AddDepositDialogView,
  title: "Ledgers/AddDepositDialog",
  args: {
    open: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClose: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => {},
    isSubmitting: false,
    date: today,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDateChange: () => {},
    amount: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onAmountChange: () => {},
    description: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDescriptionChange: () => {},
    amountError: undefined,
    descriptionError: undefined,
    submitError: undefined,
  },
};

export default meta;
type Story = StoryObj<typeof AddDepositDialogView>;

export const Empty: Story = {};

export const Submitting: Story = {
  args: {
    amount: "150.00",
    description: "Paycheck",
    isSubmitting: true,
  },
};

export const WithValidationErrors: Story = {
  args: {
    amountError: ADD_DEPOSIT_DIALOG_COPY.amountRequiredError,
    descriptionError: ADD_DEPOSIT_DIALOG_COPY.descriptionRequiredError,
  },
};
