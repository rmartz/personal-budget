import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { InvestmentLedgerListItem } from "./InvestmentLedgerListItem";
import { INVESTMENT_LEDGER_LIST_COPY } from "./copy";
import type { InvestmentLedger } from "@/lib/types";

afterEach(cleanup);

function makeInvestmentLedger(
  overrides: Partial<InvestmentLedger> = {},
): InvestmentLedger {
  return {
    id: "test-id",
    name: "Test Ledger",
    targetAllocationPercent: undefined,
    currentBalance: 0,
    ...overrides,
  };
}

describe("InvestmentLedgerListItem", () => {
  it("renders the ledger name", () => {
    const ledger = makeInvestmentLedger({ name: "My Brokerage" });
    const { getByText } = render(<InvestmentLedgerListItem ledger={ledger} />);
    expect(getByText("My Brokerage")).toBeDefined();
  });

  it("renders the balance formatted as currency", () => {
    const ledger = makeInvestmentLedger({ currentBalance: 12345.67 });
    const { getByText } = render(<InvestmentLedgerListItem ledger={ledger} />);
    expect(getByText("$12,345.67")).toBeDefined();
  });

  it("labels the balance with the copy constant", () => {
    const ledger = makeInvestmentLedger({ currentBalance: 500 });
    const { getByRole } = render(<InvestmentLedgerListItem ledger={ledger} />);
    expect(
      getByRole("generic", {
        name: INVESTMENT_LEDGER_LIST_COPY.currentBalanceLabel,
      }),
    ).toBeDefined();
  });
});
