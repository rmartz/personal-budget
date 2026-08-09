import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";

import { ReconcileTierTransfersView } from "./ReconcileTierTransfersView";

const meta: Meta<typeof ReconcileTierTransfersView> = {
  component: ReconcileTierTransfersView,
  title: "Reconcile/ReconcileTierTransfersView",
};

export default meta;
type Story = StoryObj<typeof ReconcileTierTransfersView>;

export const EmptyState: Story = {
  args: { transfers: [] },
};

export const SingleTransfer: Story = {
  args: {
    transfers: [
      {
        amount: 1200,
        from: ReconciliationAccountTier.LongTerm,
        to: ReconciliationAccountTier.ShortTerm,
      },
    ],
  },
};

export const MultipleTransfers: Story = {
  args: {
    transfers: [
      {
        amount: 2000,
        from: ReconciliationAccountTier.ShortTerm,
        to: ReconciliationAccountTier.Reserve,
      },
      {
        amount: 5000,
        from: ReconciliationAccountTier.Reserve,
        to: ReconciliationAccountTier.LongTerm,
      },
    ],
  },
};
