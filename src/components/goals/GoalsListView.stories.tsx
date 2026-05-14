import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GoalsListView } from "./GoalsListView";

const meta: Meta<typeof GoalsListView> = {
  component: GoalsListView,
  title: "Goals/GoalsListView",
};

export default meta;
type Story = StoryObj<typeof GoalsListView>;

const ledgerNames = {
  "ledger-1": "Primary",
  "ledger-2": "Travel Fund",
};

export const ErrorState: Story = {
  args: {
    goals: [],
    ledgerNames,
    isLoading: false,
    error: new Error("Firebase permission denied"),
  },
};

export const Empty: Story = {
  args: {
    goals: [],
    ledgerNames,
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    goals: [],
    ledgerNames,
    isLoading: true,
  },
};

export const PartiallyFunded: Story = {
  args: {
    ledgerNames,
    isLoading: false,
    goals: [
      {
        id: "goal-1",
        ledgerId: "ledger-1",
        name: "Emergency Fund",
        targetAmount: 10000,
        fundedAmount: 3500,
        priority: 1,
      },
      {
        id: "goal-2",
        ledgerId: "ledger-2",
        name: "Vacation to Japan",
        targetAmount: 5000,
        fundedAmount: 1200,
        priority: 2,
      },
    ],
  },
};

export const FullyFunded: Story = {
  args: {
    ledgerNames,
    isLoading: false,
    goals: [
      {
        id: "goal-1",
        ledgerId: "ledger-1",
        name: "Emergency Fund",
        targetAmount: 10000,
        fundedAmount: 10000,
        priority: 1,
      },
    ],
  },
};

export const MixedStates: Story = {
  args: {
    ledgerNames,
    isLoading: false,
    goals: [
      {
        id: "goal-1",
        ledgerId: "ledger-1",
        name: "Emergency Fund",
        targetAmount: 10000,
        fundedAmount: 10000,
        priority: 1,
      },
      {
        id: "goal-2",
        ledgerId: "ledger-2",
        name: "Vacation to Japan",
        targetAmount: 5000,
        fundedAmount: 1200,
        priority: 2,
      },
      {
        id: "goal-3",
        ledgerId: "ledger-1",
        name: "New Car",
        targetAmount: 25000,
        fundedAmount: 8000,
        priority: 3,
      },
      {
        id: "goal-4",
        ledgerId: "ledger-2",
        name: "Home Renovation",
        targetAmount: 15000,
        fundedAmount: 15000,
        priority: 4,
      },
    ],
  },
};
