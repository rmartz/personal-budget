import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DeleteAccountDialogView } from "./DeleteAccountDialog";

const meta: Meta<typeof DeleteAccountDialogView> = {
  component: DeleteAccountDialogView,
  title: "Reconcile/DeleteAccountDialog",
};

export default meta;
type Story = StoryObj<typeof DeleteAccountDialogView>;

const baseProps = {
  accountName: "Chase Checking",
  deleteError: undefined,
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
    deleteError: "Failed to delete account. Please try again.",
  },
};
