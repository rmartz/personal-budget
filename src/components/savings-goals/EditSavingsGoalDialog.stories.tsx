import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { EditSavingsGoalDialog } from "./EditSavingsGoalDialog";

const meta: Meta<typeof EditSavingsGoalDialog> = {
  component: EditSavingsGoalDialog,
  title: "Savings Goals/EditSavingsGoalDialog",
  args: {
    goal: {
      id: "goal-1",
      ledgerId: "ledger-1",
      name: "Emergency Fund",
      targetAmount: 5000,
      fundedAmount: 1000,
      priority: 1,
    },
    onSave: () => Promise.resolve(),
  },
};

export default meta;
type Story = StoryObj<typeof EditSavingsGoalDialog>;

export const Default: Story = {};

export const HighPriority: Story = {
  args: {
    goal: {
      id: "goal-2",
      ledgerId: "ledger-1",
      name: "Vacation",
      targetAmount: 2000,
      fundedAmount: 500,
      priority: 2,
    },
  },
};
