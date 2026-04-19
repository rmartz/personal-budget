import { describe, it, expect, afterEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { InvestmentLedgerList } from "./InvestmentLedgerList";
import { INVESTMENT_LEDGER_LIST_COPY } from "./copy";
import type { InvestmentLedger } from "@/lib/types";

afterEach(cleanup);

function makeInvestmentLedger(
  overrides: Partial<InvestmentLedger> = {},
): InvestmentLedger {
  return {
    id: "test-id",
    name: "Test Ledger",
    currentBalance: 0,
    ...overrides,
  };
}

describe("InvestmentLedgerList", () => {
  describe("loading state", () => {
    it("does not render the empty state heading", () => {
      const { queryByText } = render(
        <InvestmentLedgerList
          ledgers={[]}
          isLoading={true}
          onNewLedger={vi.fn()}
        />,
      );
      expect(
        queryByText(INVESTMENT_LEDGER_LIST_COPY.emptyStateHeading),
      ).toBeNull();
    });

    it("renders the loading container with aria-label", () => {
      const { getByRole } = render(
        <InvestmentLedgerList
          ledgers={[]}
          isLoading={true}
          onNewLedger={vi.fn()}
        />,
      );
      expect(
        getByRole("generic", {
          name: INVESTMENT_LEDGER_LIST_COPY.loadingLabel,
        }),
      ).toBeDefined();
    });
  });

  describe("empty state", () => {
    it("renders the empty state heading", () => {
      const { getByText } = render(
        <InvestmentLedgerList
          ledgers={[]}
          isLoading={false}
          onNewLedger={vi.fn()}
        />,
      );
      expect(
        getByText(INVESTMENT_LEDGER_LIST_COPY.emptyStateHeading),
      ).toBeDefined();
    });

    it("renders the empty state description", () => {
      const { getByText } = render(
        <InvestmentLedgerList
          ledgers={[]}
          isLoading={false}
          onNewLedger={vi.fn()}
        />,
      );
      expect(
        getByText(INVESTMENT_LEDGER_LIST_COPY.emptyStateDescription),
      ).toBeDefined();
    });

    it("renders the new ledger button", () => {
      const { getByText } = render(
        <InvestmentLedgerList
          ledgers={[]}
          isLoading={false}
          onNewLedger={vi.fn()}
        />,
      );
      expect(
        getByText(INVESTMENT_LEDGER_LIST_COPY.newLedgerButton),
      ).toBeDefined();
    });
  });

  describe("populated state", () => {
    it("renders each ledger name", () => {
      const ledgers = [
        makeInvestmentLedger({ id: "1", name: "Stocks", currentBalance: 1000 }),
        makeInvestmentLedger({ id: "2", name: "Bonds", currentBalance: 500 }),
      ];
      const { getByText } = render(
        <InvestmentLedgerList
          ledgers={ledgers}
          isLoading={false}
          onNewLedger={vi.fn()}
        />,
      );
      expect(getByText("Stocks")).toBeDefined();
      expect(getByText("Bonds")).toBeDefined();
    });

    it("renders each ledger balance formatted as currency", () => {
      const ledgers = [
        makeInvestmentLedger({
          id: "1",
          name: "Stocks",
          currentBalance: 45000,
        }),
        makeInvestmentLedger({ id: "2", name: "Bonds", currentBalance: 1250 }),
      ];
      const { getByText } = render(
        <InvestmentLedgerList
          ledgers={ledgers}
          isLoading={false}
          onNewLedger={vi.fn()}
        />,
      );
      expect(getByText("$45,000.00")).toBeDefined();
      expect(getByText("$1,250.00")).toBeDefined();
    });
  });
});
