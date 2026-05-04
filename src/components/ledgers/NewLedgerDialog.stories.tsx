import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NewLedgerDialogView } from "./NewLedgerDialog";

const meta: Meta<typeof NewLedgerDialogView> = {
  component: NewLedgerDialogView,
  title: "Ledgers/NewLedgerDialog",
  args: {
    open: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpenChange: () => {},
    name: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onNameChange: () => {},
    cashCap: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onCashCapChange: () => {},
    nameError: undefined,
    cashCapError: undefined,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => {},
    isSubmitting: false,
  },
};

export default meta;
type Story = StoryObj<typeof NewLedgerDialogView>;

export const EmptyForm: Story = {};

export const ValidationErrors: Story = {
  args: {
    nameError: "Name is required.",
    cashCapError: "Cash cap must be a positive number.",
    cashCap: "-5",
  },
};

export const Submitting: Story = {
  args: {
    name: "Everyday Spending",
    cashCap: "500",
    isSubmitting: true,
  },
};
