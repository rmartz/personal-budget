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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDeleteDialogOpenChange: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDeleteMenuClick: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDeleteConfirm: () => {},
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

// Shows the row state just before the delete menu is opened (overflow button visible).
// Click "More options" in Storybook to see the dropdown menu.
export const DeleteMenuOpen: Story = {
  args: {
    goal,
    deleteDialogOpen: false,
  },
};

export const ConfirmDialogOpen: Story = {
  args: {
    goal,
    deleteDialogOpen: true,
  },
};
