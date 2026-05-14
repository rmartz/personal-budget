import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Ledger } from "@/lib/types";

import { LEDGERS_PAGE_COPY } from "./copy";
import { LedgerList } from "./LedgerList";

afterEach(cleanup);

function makeLedger(overrides: Partial<Ledger> = {}): Ledger {
  return {
    id: "test-id",
    name: "Test Ledger",
    cashCap: undefined,
    cashBalance: 100,
    investmentBalance: 50,
    goalsCount: 0,
    ...overrides,
  };
}

describe("LedgerList", () => {
  const onNewLedger = vi.fn();
  const onEditLedger = vi.fn().mockResolvedValue(undefined);
  const onDeleteLedger = vi.fn();

  describe("empty state", () => {
    it("renders the empty state message when there are no ledgers", () => {
      render(
        <LedgerList
          ledgers={[]}
          isLoading={false}
          onNewLedger={onNewLedger}
          onEditLedger={onEditLedger}
          onDeleteLedger={onDeleteLedger}
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
          onDeleteLedger={onDeleteLedger}
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
          onDeleteLedger={onDeleteLedger}
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
          onDeleteLedger={onDeleteLedger}
        />,
      );
      expect(screen.getAllByText("Everyday Spending").length).toBeGreaterThan(
        0,
      );
      expect(screen.getAllByText("Emergency Fund").length).toBeGreaterThan(0);
    });

    it("does not render the empty state message when ledgers exist", () => {
      const ledgers = [makeLedger({ id: "1" })];
      render(
        <LedgerList
          ledgers={ledgers}
          isLoading={false}
          onNewLedger={onNewLedger}
          onEditLedger={onEditLedger}
          onDeleteLedger={onDeleteLedger}
        />,
      );
      expect(
        screen.queryByText(LEDGERS_PAGE_COPY.emptyStateMessage),
      ).toBeNull();
    });
  });

  describe("header summary sub line", () => {
    it("shows the correct ledger count in the summary", () => {
      const ledgers = [makeLedger({ id: "1" }), makeLedger({ id: "2" })];
      render(
        <LedgerList
          ledgers={ledgers}
          isLoading={false}
          onNewLedger={onNewLedger}
          onEditLedger={onEditLedger}
          onDeleteLedger={onDeleteLedger}
        />,
      );
      expect(screen.getByText(/2 active ·/)).toBeDefined();
    });

    it("uses 'active' when there is exactly one ledger", () => {
      render(
        <LedgerList
          ledgers={[makeLedger({ id: "1" })]}
          isLoading={false}
          onNewLedger={onNewLedger}
          onEditLedger={onEditLedger}
          onDeleteLedger={onDeleteLedger}
        />,
      );
      expect(screen.getByText(/1 active ·/)).toBeDefined();
    });

    it("shows the combined cash and investment total in the summary", () => {
      const ledgers = [
        makeLedger({ id: "1", cashBalance: 1000, investmentBalance: 200 }),
        makeLedger({ id: "2", cashBalance: 500, investmentBalance: 300 }),
      ];
      render(
        <LedgerList
          ledgers={ledgers}
          isLoading={false}
          onNewLedger={onNewLedger}
          onEditLedger={onEditLedger}
          onDeleteLedger={onDeleteLedger}
        />,
      );
      expect(screen.getByText(/\$2,000\.00 total/)).toBeDefined();
    });
  });
});
