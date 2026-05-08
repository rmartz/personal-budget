import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AddDepositDialogView } from "./AddDepositDialog";

const meta: Meta<typeof AddDepositDialogView> = {
  component: AddDepositDialogView,
  title: "Ledgers/AddDepositDialog",
  args: {
    open: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClose: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: async () => {},
    isSubmitting: false,
  },
};

export default meta;
type Story = StoryObj<typeof AddDepositDialogView>;

export const Empty: Story = {};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};
