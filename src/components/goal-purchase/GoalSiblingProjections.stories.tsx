import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GoalSiblingProjections } from "./GoalSiblingProjections";

const meta: Meta<typeof GoalSiblingProjections> = {
  component: GoalSiblingProjections,
  title: "GoalPurchase/GoalSiblingProjections",
};

export default meta;
type Story = StoryObj<typeof GoalSiblingProjections>;

const purchasedGoal = {
  id: "goal-1",
  ledgerId: "ledger-1",
  name: "Studio Display",
  targetAmount: 1599,
  fundedAmount: 1599,
  priority: 1,
};

const siblingGoals = [
  {
    id: "goal-2",
    ledgerId: "ledger-1",
    name: "MacBook Pro",
    targetAmount: 2499,
    fundedAmount: 1200,
    priority: 2,
  },
  {
    id: "goal-3",
    ledgerId: "ledger-1",
    name: "Mechanical Keyboard",
    targetAmount: 350,
    fundedAmount: 100,
    priority: 3,
  },
];

export const WithSiblings: Story = {
  args: {
    monthlyAllocation: 400,
    purchasedGoal,
    siblingGoals,
  },
};

export const NoAllocation: Story = {
  args: {
    monthlyAllocation: 0,
    purchasedGoal,
    siblingGoals,
  },
};

export const NoSiblings: Story = {
  args: {
    monthlyAllocation: 400,
    purchasedGoal,
    siblingGoals: [],
  },
};
