import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GoalProgressBar } from "./GoalProgressBar";

const meta: Meta<typeof GoalProgressBar> = {
  component: GoalProgressBar,
  title: "Goals/GoalProgressBar",
};

export default meta;
type Story = StoryObj<typeof GoalProgressBar>;

export const Unfunded: Story = {
  args: {
    fundedAmount: 0,
    targetAmount: 10000,
  },
};

export const PartiallyFunded: Story = {
  args: {
    fundedAmount: 3500,
    targetAmount: 10000,
  },
};

export const MostlyFunded: Story = {
  args: {
    fundedAmount: 9200,
    targetAmount: 10000,
  },
};

export const FullyFunded: Story = {
  args: {
    fundedAmount: 10000,
    targetAmount: 10000,
  },
};

export const OverFunded: Story = {
  args: {
    fundedAmount: 10500,
    targetAmount: 10000,
  },
};

export const NoTarget: Story = {
  args: {
    fundedAmount: 0,
    targetAmount: 0,
  },
};
