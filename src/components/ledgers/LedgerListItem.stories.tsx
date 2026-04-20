import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LedgerListItemView } from "./LedgerListItem";

const sampleLedger = {
  id: "1",
  name: "Everyday Spending",
  cashCap: 2000,
  cashBalance: 1250.0,
  investmentBalance: 500.0,
};

const meta: Meta<typeof LedgerListItemView> = {
  component: LedgerListItemView,
  title: "Ledgers/LedgerListItem",
  decorators: [
    (Story) => (
      <ul>
        <Story />
      </ul>
    ),
  ],
  args: {
    ledger: sampleLedger,
    dialogOpen: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDialogOpenChange: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDeleteMenuClick: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDeleteConfirm: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof LedgerListItemView>;

export const Default: Story = {};

export const WithNoCashCap: Story = {
  args: {
    ledger: {
      ...sampleLedger,
      cashCap: undefined,
    },
  },
};

export const DeleteDialogOpen: Story = {
  args: {
    dialogOpen: true,
  },
};
