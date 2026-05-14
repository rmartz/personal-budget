import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AnnuityMonthlyMode } from "@/lib/firebase/schema/annuities";

import { AnnuityPaymentHistoryTable } from "./AnnuityPaymentHistoryTable";

const meta: Meta<typeof AnnuityPaymentHistoryTable> = {
  component: AnnuityPaymentHistoryTable,
  title: "Annuities/AnnuityPaymentHistoryTable",
};

export default meta;
type Story = StoryObj<typeof AnnuityPaymentHistoryTable>;

export const Default: Story = {
  args: {
    annuity: {
      id: "1",
      name: "Mortgage",
      monthlyAmount: 978.63,
      startDate: new Date("2020-01-01"),
      durationMonths: 360,
      monthlyMode: AnnuityMonthlyMode.PVDerived,
    },
  },
};
