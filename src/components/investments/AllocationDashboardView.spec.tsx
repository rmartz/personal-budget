import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AllocationDashboardView } from "./AllocationDashboardView";
import { TARGET_ALLOCATION_COPY } from "./copy";

afterEach(cleanup);

const makeInvestmentAccount = (
  overrides?: Partial<{
    id: string;
    name: string;
    currentPercent: number;
    targetPercent: number;
  }>,
) => ({
  id: "acc-1",
  name: "Stocks",
  currentPercent: 60,
  targetPercent: 70,
  ...overrides,
});

describe("AllocationDashboardView — empty state", () => {
  it("renders the card title", () => {
    const { getByText } = render(<AllocationDashboardView accounts={[]} />);
    expect(getByText(TARGET_ALLOCATION_COPY.title)).toBeDefined();
  });

  it("renders the empty state message when no accounts provided", () => {
    const { getByText } = render(<AllocationDashboardView accounts={[]} />);
    expect(
      getByText(TARGET_ALLOCATION_COPY.noAccountsConfigured),
    ).toBeDefined();
  });
});

describe("AllocationDashboardView — account names", () => {
  it("renders each account name", () => {
    const accounts = [
      makeInvestmentAccount({
        id: "a",
        name: "Stocks",
        currentPercent: 60,
        targetPercent: 60,
      }),
      makeInvestmentAccount({
        id: "b",
        name: "Bonds",
        currentPercent: 30,
        targetPercent: 30,
      }),
    ];
    const { getByText } = render(
      <AllocationDashboardView accounts={accounts} />,
    );
    expect(getByText("Stocks")).toBeDefined();
    expect(getByText("Bonds")).toBeDefined();
  });
});

describe("AllocationDashboardView — current and target percentages", () => {
  it("renders current and target percent for each account", () => {
    const accounts = [
      makeInvestmentAccount({ currentPercent: 65, targetPercent: 70 }),
    ];
    const { getByText } = render(
      <AllocationDashboardView accounts={accounts} />,
    );
    expect(getByText("65%")).toBeDefined();
    expect(getByText("70%")).toBeDefined();
  });
});

describe("AllocationDashboardView — deviation display", () => {
  it("shows a negative deviation when account is under target", () => {
    const accounts = [
      makeInvestmentAccount({ currentPercent: 60, targetPercent: 70 }),
    ];
    const { getByText } = render(
      <AllocationDashboardView accounts={accounts} />,
    );
    expect(getByText("-10.0%")).toBeDefined();
  });

  it("shows a positive deviation when account is over target", () => {
    const accounts = [
      makeInvestmentAccount({ currentPercent: 75, targetPercent: 70 }),
    ];
    const { getByText } = render(
      <AllocationDashboardView accounts={accounts} />,
    );
    expect(getByText("+5.0%")).toBeDefined();
  });

  it("shows zero deviation when account is exactly at target", () => {
    const accounts = [
      makeInvestmentAccount({ currentPercent: 70, targetPercent: 70 }),
    ];
    const { getByText } = render(
      <AllocationDashboardView accounts={accounts} />,
    );
    expect(getByText("0.0%")).toBeDefined();
  });
});

describe("AllocationDashboardView — footer note", () => {
  it("renders the footer note when accounts are present", () => {
    const accounts = [makeInvestmentAccount()];
    const { getByText } = render(
      <AllocationDashboardView accounts={accounts} />,
    );
    expect(getByText(TARGET_ALLOCATION_COPY.footerNote)).toBeDefined();
  });

  it("does not render the footer note when no accounts provided", () => {
    const { queryByText } = render(<AllocationDashboardView accounts={[]} />);
    expect(queryByText(TARGET_ALLOCATION_COPY.footerNote)).toBeNull();
  });
});

describe("AllocationDashboardView — output shape", () => {
  it("renders one row per account", () => {
    const accounts = [
      makeInvestmentAccount({ id: "a", name: "Stocks" }),
      makeInvestmentAccount({ id: "b", name: "Bonds" }),
      makeInvestmentAccount({ id: "c", name: "International" }),
    ];
    const { getAllByRole } = render(
      <AllocationDashboardView accounts={accounts} />,
    );
    // Each account row contains a progressbar
    const bars = getAllByRole("progressbar");
    expect(bars).toHaveLength(3);
  });
});
