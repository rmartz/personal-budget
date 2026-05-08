import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CreateLedgerDialog } from "./CreateLedgerDialog";

const meta: Meta<typeof CreateLedgerDialog> = {
  component: CreateLedgerDialog,
  title: "Ledgers/CreateLedgerDialog",
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
type Story = StoryObj<typeof CreateLedgerDialog>;

export const Empty: Story = {};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};
