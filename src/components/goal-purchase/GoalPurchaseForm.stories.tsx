import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GoalPurchaseForm } from "./GoalPurchaseForm";

const meta: Meta<typeof GoalPurchaseForm> = {
  component: GoalPurchaseForm,
  title: "GoalPurchase/GoalPurchaseForm",
};

export default meta;
type Story = StoryObj<typeof GoalPurchaseForm>;

export const Default: Story = {
  args: {
    ledgerName: "Primary",
    targetAmount: 1500,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => {},
  },
};

export const HighValueGoal: Story = {
  args: {
    ledgerName: "Tech Fund",
    targetAmount: 25000,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => {},
  },
};
