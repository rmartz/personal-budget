import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnnuityListView } from "./AnnuityListView";

const meta: Meta<typeof AnnuityListView> = {
  component: AnnuityListView,
  title: "Annuities/AnnuityListView",
};

export default meta;
type Story = StoryObj<typeof AnnuityListView>;

export const Empty: Story = {
  args: {
    annuities: [],
    isLoading: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onNewAnnuity: () => {},
  },
};

export const Loading: Story = {
  args: {
    annuities: [],
    isLoading: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onNewAnnuity: () => {},
  },
};

export const PopulatedFlatRate: Story = {
  args: {
    isLoading: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onNewAnnuity: () => {},
    annuities: [
      {
        id: "1",
        name: "Netflix",
        monthlyAmount: 15.99,
        startDate: new Date("2024-01-01"),
        durationMonths: undefined,
      },
      {
        id: "2",
        name: "Spotify",
        monthlyAmount: 9.99,
        startDate: new Date("2024-03-01"),
        durationMonths: undefined,
      },
    ],
  },
};

export const PopulatedFixedTerm: Story = {
  args: {
    isLoading: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onNewAnnuity: () => {},
    annuities: [
      {
        id: "1",
        name: "Car Loan",
        monthlyAmount: 425.5,
        startDate: new Date("2023-06-01"),
        durationMonths: 48,
      },
      {
        id: "2",
        name: "Home Improvement Loan",
        monthlyAmount: 210.0,
        startDate: new Date("2024-01-01"),
        durationMonths: 24,
      },
    ],
  },
};

export const PopulatedMixed: Story = {
  args: {
    isLoading: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onNewAnnuity: () => {},
    annuities: [
      {
        id: "1",
        name: "Netflix",
        monthlyAmount: 15.99,
        startDate: new Date("2024-01-01"),
        durationMonths: undefined,
      },
      {
        id: "2",
        name: "Car Loan",
        monthlyAmount: 425.5,
        startDate: new Date("2023-06-01"),
        durationMonths: 48,
      },
      {
        id: "3",
        name: "Pension",
        monthlyAmount: 1800.0,
        startDate: new Date("2025-01-01"),
        durationMonths: undefined,
      },
      {
        id: "4",
        name: "Home Improvement Loan",
        monthlyAmount: 210.0,
        startDate: new Date("2024-01-01"),
        durationMonths: 24,
      },
    ],
  },
};
