import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SavingsGoalListView } from "./SavingsGoalList";

const meta: Meta<typeof SavingsGoalListView> = {
  component: SavingsGoalListView,
  title: "Savings Goals/SavingsGoalList",
};

export default meta;
type Story = StoryObj<typeof SavingsGoalListView>;

export const Empty: Story = {
  args: {
    goals: [],
  },
};

export const PartiallyFunded: Story = {
  args: {
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
        ledgerId: "ledger-1",
        name: "Vacation",
        targetAmount: 2000,
        fundedAmount: 750,
        priority: 2,
      },
      {
        id: "goal-3",
        ledgerId: "ledger-1",
        name: "New Car",
        targetAmount: 15000,
        fundedAmount: 1000,
        priority: 3,
      },
    ],
  },
};

export const FullyFunded: Story = {
  args: {
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
        ledgerId: "ledger-1",
        name: "Vacation",
        targetAmount: 2000,
        fundedAmount: 2000,
        priority: 2,
      },
    ],
  },
};
