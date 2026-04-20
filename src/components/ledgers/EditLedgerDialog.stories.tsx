import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EditLedgerDialog } from "./EditLedgerDialog";

const meta: Meta<typeof EditLedgerDialog> = {
  component: EditLedgerDialog,
  title: "Ledgers/EditLedgerDialog",
  args: {
    ledgerId: "ledger-1",
    initialName: "Everyday Spending",
    initialCashCap: 2000,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSave: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof EditLedgerDialog>;

export const WithCashCap: Story = {};

export const WithoutCashCap: Story = {
  args: {
    initialName: "Emergency Fund",
    initialCashCap: undefined,
  },
};
