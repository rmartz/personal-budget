import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AccountTier } from "@/lib/firebase/schema/accounts";

import { AccountsView } from "./AccountsView";

const meta: Meta<typeof AccountsView> = {
  component: AccountsView,
  title: "Accounts/AccountsView",
};

export default meta;
type Story = StoryObj<typeof AccountsView>;

export const Empty: Story = {
  args: {
    accounts: [],
    recurringExpenses: [],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onAddAccount: () => {},
  },
};

export const Populated: Story = {
  args: {
    accounts: [
      { id: "1", name: "Chase Checking", tier: AccountTier.ShortTerm },
      { id: "2", name: "Ally Savings", tier: AccountTier.Reserve },
      { id: "3", name: "Vanguard Money Market", tier: AccountTier.LongTerm },
      { id: "4", name: "Fidelity 401k", tier: AccountTier.Investment },
    ],
    recurringExpenses: [
      { id: "1", name: "Rent", amount: 2000 },
      { id: "2", name: "Internet", amount: 60 },
      { id: "3", name: "Phone", amount: 45 },
    ],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onAddAccount: () => {},
  },
};
