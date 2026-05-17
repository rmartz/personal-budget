import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AnnuityMonthlyMode } from "@/lib/firebase/schema/annuities";

import { AnnuityCard } from "./AnnuityCard";

const meta: Meta<typeof AnnuityCard> = {
  component: AnnuityCard,
  title: "Annuities/AnnuityCard",
};

export default meta;
type Story = StoryObj<typeof AnnuityCard>;

const baseAnnuity = {
  id: "1",
  name: "Mortgage",
  monthlyAmount: 978.63,
  startDate: new Date("2020-01-01"),
  durationMonths: 360,
  monthlyMode: AnnuityMonthlyMode.PVDerived,
};

export const Default: Story = {
  args: {
    annuity: baseAnnuity,
  },
};

export const Selected: Story = {
  args: {
    annuity: baseAnnuity,
    isSelected: true,
  },
};

export const FlatMode: Story = {
  args: {
    annuity: { ...baseAnnuity, monthlyMode: AnnuityMonthlyMode.Flat },
  },
};

export const NoTerm: Story = {
  args: {
    annuity: {
      ...baseAnnuity,
      name: "Subscription",
      durationMonths: undefined,
      monthlyAmount: 15.99,
    },
  },
};

export const WithActions: Story = {
  args: {
    annuity: baseAnnuity,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onEdit: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDelete: () => {},
  },
};

export const WithActionsSelected: Story = {
  args: {
    annuity: baseAnnuity,
    isSelected: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onEdit: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDelete: () => {},
  },
};

export const WithPrincipal: Story = {
  args: {
    annuity: {
      ...baseAnnuity,
      annualRatePercent: 6,
      presentValue: 350000,
    },
  },
};
