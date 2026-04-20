import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LedgerList } from "./LedgerList";

const meta: Meta<typeof LedgerList> = {
  component: LedgerList,
  title: "Ledgers/LedgerList",
  args: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onNewLedger: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDeleteLedger: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof LedgerList>;

export const Empty: Story = {
  args: {
    ledgers: [],
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    ledgers: [],
    isLoading: true,
  },
};

export const Populated: Story = {
  args: {
    isLoading: false,
    ledgers: [
      {
        id: "1",
        name: "Everyday Spending",
        cashCap: 2000,
        cashBalance: 1250.0,
        investmentBalance: 500.0,
      },
      {
        id: "2",
        name: "Emergency Fund",
        cashCap: undefined,
        cashBalance: 8500.75,
        investmentBalance: 0,
      },
      {
        id: "3",
        name: "Vacation",
        cashCap: 5000,
        cashBalance: 300.5,
        investmentBalance: 1200.0,
      },
    ],
  },
};
