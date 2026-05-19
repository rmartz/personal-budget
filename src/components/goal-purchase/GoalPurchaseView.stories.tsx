import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GoalPurchaseView } from "./GoalPurchaseView";

const meta: Meta<typeof GoalPurchaseView> = {
  component: GoalPurchaseView,
  title: "GoalPurchase/GoalPurchaseView",
};

export default meta;
type Story = StoryObj<typeof GoalPurchaseView>;

const baseGoal = {
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

const referenceDate = new Date(2025, 5, 1);

export const NoSiblings: Story = {
  args: {
    goal: baseGoal,
    ledgerCashBalance: 2000,
    ledgerName: "Tech Fund",
    monthlyAllocation: 400,
    referenceDate,
    siblingGoals: [],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => {},
  },
};

export const WithSiblings: Story = {
  args: {
    goal: baseGoal,
    ledgerCashBalance: 2000,
    ledgerName: "Tech Fund",
    monthlyAllocation: 400,
    referenceDate,
    siblingGoals,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => {},
  },
};

export const InsufficientCash: Story = {
  args: {
    goal: baseGoal,
    ledgerCashBalance: 0,
    ledgerName: "Tech Fund",
    monthlyAllocation: 400,
    referenceDate,
    siblingGoals,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => {},
  },
};
