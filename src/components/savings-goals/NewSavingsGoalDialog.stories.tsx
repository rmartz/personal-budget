import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { NewSavingsGoalDialogView } from "./NewSavingsGoalDialog";
import { NEW_SAVINGS_GOAL_DIALOG_COPY } from "./NewSavingsGoalDialog.copy";

const meta: Meta<typeof NewSavingsGoalDialogView> = {
  component: NewSavingsGoalDialogView,
  title: "Savings Goals/NewSavingsGoalDialog",
  args: {
    open: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpenChange: () => {},
    name: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onNameChange: () => {},
    targetAmount: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onTargetAmountChange: () => {},
    nameError: undefined,
    targetAmountError: undefined,
    submitError: undefined,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => {},
    isSubmitting: false,
  },
};

export default meta;
type Story = StoryObj<typeof NewSavingsGoalDialogView>;

export const EmptyForm: Story = {};

export const ValidationErrors: Story = {
  args: {
    nameError: NEW_SAVINGS_GOAL_DIALOG_COPY.nameError,
    targetAmountError: NEW_SAVINGS_GOAL_DIALOG_COPY.targetAmountError,
    targetAmount: "-100",
  },
};

export const SubmitError: Story = {
  args: {
    name: "Emergency Fund",
    targetAmount: "5000",
    submitError: NEW_SAVINGS_GOAL_DIALOG_COPY.submitError,
  },
};

export const Submitting: Story = {
  args: {
    name: "Emergency Fund",
    targetAmount: "5000",
    isSubmitting: true,
  },
};
