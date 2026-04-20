import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { LedgerList } from "./LedgerList";
import { LEDGERS_PAGE_COPY } from "./copy";
import type { Ledger } from "@/lib/types";

afterEach(cleanup);

function makeLedger(overrides: Partial<Ledger> = {}): Ledger {
  return {
    id: "test-id",
    name: "Test Ledger",
    cashCap: undefined,
    cashBalance: 100,
    investmentBalance: 50,
    ...overrides,
  };
}

describe("LedgerList", () => {
  const onNewLedger = vi.fn();
  const onEditLedger = vi.fn();

  describe("empty state", () => {
    it("renders the empty state message when there are no ledgers", () => {
      render(
        <LedgerList
          ledgers={[]}
          isLoading={false}
          onNewLedger={onNewLedger}
          onEditLedger={onEditLedger}
        />,
      );
      expect(
        screen.getByText(LEDGERS_PAGE_COPY.emptyStateMessage),
      ).toBeDefined();
    });

    it("renders the New Ledger button in empty state", () => {
      render(
        <LedgerList
          ledgers={[]}
          isLoading={false}
          onNewLedger={onNewLedger}
          onEditLedger={onEditLedger}
        />,
      );
      expect(screen.getByText(LEDGERS_PAGE_COPY.newLedgerButton)).toBeDefined();
    });
  });

  describe("loading state", () => {
    it("does not render the empty state message while loading", () => {
      render(
        <LedgerList
          ledgers={[]}
          isLoading={true}
          onNewLedger={onNewLedger}
          onEditLedger={onEditLedger}
        />,
      );
      expect(
        screen.queryByText(LEDGERS_PAGE_COPY.emptyStateMessage),
      ).toBeNull();
    });
  });

  describe("populated state", () => {
    it("renders each ledger name", () => {
      const ledgers = [
        makeLedger({ id: "1", name: "Everyday Spending" }),
        makeLedger({ id: "2", name: "Emergency Fund" }),
      ];
      render(
        <LedgerList
          ledgers={ledgers}
          isLoading={false}
          onNewLedger={onNewLedger}
          onEditLedger={onEditLedger}
        />,
      );
      expect(screen.getByText("Everyday Spending")).toBeDefined();
      expect(screen.getByText("Emergency Fund")).toBeDefined();
    });

    it("renders the formatted total balance for each ledger", () => {
      const ledgers = [
        makeLedger({
          id: "1",
          name: "Savings",
          cashBalance: 1000,
          investmentBalance: 500,
        }),
      ];
      render(
        <LedgerList
          ledgers={ledgers}
          isLoading={false}
          onNewLedger={onNewLedger}
          onEditLedger={onEditLedger}
        />,
      );
      expect(screen.getByText("$1,500.00")).toBeDefined();
    });

    it("does not render the empty state message when ledgers exist", () => {
      const ledgers = [makeLedger({ id: "1" })];
      render(
        <LedgerList
          ledgers={ledgers}
          isLoading={false}
          onNewLedger={onNewLedger}
          onEditLedger={onEditLedger}
        />,
      );
      expect(
        screen.queryByText(LEDGERS_PAGE_COPY.emptyStateMessage),
      ).toBeNull();
    });
  });
});
