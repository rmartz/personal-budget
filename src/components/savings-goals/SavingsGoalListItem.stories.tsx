import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SavingsGoalListItemView } from "./SavingsGoalListItem";

const meta: Meta<typeof SavingsGoalListItemView> = {
  component: SavingsGoalListItemView,
  title: "Savings Goals/SavingsGoalListItem",
  decorators: [
    (Story) => (
      <table>
        <tbody>
          <Story />
        </tbody>
      </table>
    ),
  ],
  args: {
    isFirst: false,
    isLast: false,
    prevGoalId: "goal-0",
    nextGoalId: "goal-2",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDeleteDialogOpenChange: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDeleteMenuClick: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDeleteConfirm: () => {},
    onEdit: () => Promise.resolve(),
    onReorder: () => Promise.resolve(),
  },
};

export default meta;
type Story = StoryObj<typeof SavingsGoalListItemView>;

const goal = {
  id: "goal-1",
  ledgerId: "ledger-1",
  name: "Emergency Fund",
  targetAmount: 10000,
  fundedAmount: 3500,
  priority: 1,
};

export const Default: Story = {
  args: {
    goal,
    deleteDialogOpen: false,
  },
};

export const FirstItem: Story = {
  args: {
    goal,
    deleteDialogOpen: false,
    isFirst: true,
    prevGoalId: undefined,
  },
};

export const LastItem: Story = {
  args: {
    goal,
    deleteDialogOpen: false,
    isLast: true,
    nextGoalId: undefined,
  },
};

export const DeleteMenuOpen: Story = {
  args: {
    goal,
    deleteDialogOpen: false,
    dropdownOpen: true,
  },
};

export const ConfirmDialogOpen: Story = {
  args: {
    goal,
    deleteDialogOpen: true,
  },
};
