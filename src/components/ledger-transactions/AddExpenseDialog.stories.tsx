import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AddExpenseDialog } from "./AddExpenseDialog";

const meta: Meta<typeof AddExpenseDialog> = {
  component: AddExpenseDialog,
  title: "Ledgers/AddExpenseDialog",
  args: {
    open: true,
    isSubmitting: false,
    onClose: () => undefined,
    onSubmit: () => Promise.resolve(),
  },
};

export default meta;
type Story = StoryObj<typeof AddExpenseDialog>;

export const Default: Story = {};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};

export const SubmitError: Story = {
  args: {
    onSubmit: () => Promise.reject(new Error("Firebase error")),
  },
};
