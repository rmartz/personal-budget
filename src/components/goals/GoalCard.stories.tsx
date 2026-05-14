import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GoalCard } from "./GoalCard";

const meta: Meta<typeof GoalCard> = {
  component: GoalCard,
  title: "Goals/GoalCard",
};

export default meta;
type Story = StoryObj<typeof GoalCard>;

const baseGoal = {
  id: "goal-1",
  ledgerId: "ledger-1",
  name: "Emergency Fund",
  targetAmount: 10000,
  priority: 1,
};

export const PartiallyFunded: Story = {
  args: {
    goal: { ...baseGoal, fundedAmount: 3500 },
    ledgerName: "Primary",
  },
};

export const MostlyFunded: Story = {
  args: {
    goal: { ...baseGoal, fundedAmount: 9000 },
    ledgerName: "Primary",
  },
};

export const FullyFunded: Story = {
  args: {
    goal: { ...baseGoal, fundedAmount: 10000 },
    ledgerName: "Primary",
  },
};

export const ReadyToPurchase: Story = {
  args: {
    goal: {
      id: "goal-2",
      ledgerId: "ledger-2",
      name: "New Laptop",
      targetAmount: 1500,
      fundedAmount: 1500,
      priority: 2,
    },
    ledgerName: "Tech Fund",
  },
};

export const UnfundedHighPriority: Story = {
  args: {
    goal: {
      id: "goal-3",
      ledgerId: "ledger-1",
      name: "Vacation to Japan",
      targetAmount: 5000,
      fundedAmount: 0,
      priority: 1,
    },
    ledgerName: "Travel",
  },
};
