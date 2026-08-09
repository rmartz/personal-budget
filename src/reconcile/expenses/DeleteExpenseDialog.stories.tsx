import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DeleteExpenseDialogView } from "./DeleteExpenseDialog";

const meta: Meta<typeof DeleteExpenseDialogView> = {
  component: DeleteExpenseDialogView,
  title: "Reconcile/DeleteExpenseDialog",
};

export default meta;
type Story = StoryObj<typeof DeleteExpenseDialogView>;

const baseProps = {
  deleteError: undefined,
  expenseName: "Electric bill",
  isDeleting: false,
  onConfirm: () => undefined,
  onOpenChange: () => undefined,
  open: true,
};

export const Default: Story = {
  args: baseProps,
};

export const Deleting: Story = {
  args: {
    ...baseProps,
    isDeleting: true,
  },
};

export const WithError: Story = {
  args: {
    ...baseProps,
    deleteError: "Failed to delete expense. Please try again.",
  },
};
