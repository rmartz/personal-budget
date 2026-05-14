import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SetupSummaryRow } from "./SetupSummaryRow";

const meta: Meta<typeof SetupSummaryRow> = {
  component: SetupSummaryRow,
  title: "Accounts/SetupSummaryRow",
};

export default meta;
type Story = StoryObj<typeof SetupSummaryRow>;

export const AccountsEmpty: Story = {
  args: {
    label: "Accounts",
    count: 0,
    sublabel: "Short-term · Reserve · Long-term · Investment",
  },
};

export const AccountsPopulated: Story = {
  args: {
    label: "Accounts",
    count: 4,
    sublabel: "Short-term · Reserve · Long-term · Investment",
  },
};

export const RecurringExpensesEmpty: Story = {
  args: {
    label: "Recurring expenses",
    count: 0,
    sublabel: "0 missing this month",
  },
};

export const RecurringExpensesPopulated: Story = {
  args: {
    label: "Recurring expenses",
    count: 12,
    sublabel: "2 missing this month",
  },
};
