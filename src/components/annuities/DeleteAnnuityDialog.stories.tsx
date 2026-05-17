import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AnnuityMonthlyMode } from "@/lib/firebase/schema/annuities";

import { DELETE_ANNUITY_DIALOG_COPY } from "./copy";
import { DeleteAnnuityDialog } from "./DeleteAnnuityDialog";

const meta: Meta<typeof DeleteAnnuityDialog> = {
  component: DeleteAnnuityDialog,
  title: "Annuities/DeleteAnnuityDialog",
  args: {
    open: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpenChange: () => {},
    annuity: {
      id: "1",
      name: "Car Loan",
      monthlyAmount: 250,
      startDate: new Date("2023-01-01"),
      durationMonths: 60,
      monthlyMode: AnnuityMonthlyMode.Flat,
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onConfirm: () => {},
    isDeleting: false,
    deleteError: undefined,
  },
};

export default meta;
type Story = StoryObj<typeof DeleteAnnuityDialog>;

export const Default: Story = {};

export const Deleting: Story = {
  args: {
    isDeleting: true,
  },
};

export const WithError: Story = {
  args: {
    deleteError: DELETE_ANNUITY_DIALOG_COPY.deleteError,
  },
};
