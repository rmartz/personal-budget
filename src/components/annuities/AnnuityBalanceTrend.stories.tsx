import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnnuityBalanceTrend } from "./AnnuityBalanceTrend";
import { AnnuityMonthlyMode } from "@/lib/firebase/schema/annuities";

const meta: Meta<typeof AnnuityBalanceTrend> = {
  component: AnnuityBalanceTrend,
  title: "Annuities/AnnuityBalanceTrend",
};

export default meta;
type Story = StoryObj<typeof AnnuityBalanceTrend>;

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
