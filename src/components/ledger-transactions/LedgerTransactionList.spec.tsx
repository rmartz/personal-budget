import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { LedgerTransactionListView } from "./LedgerTransactionList";
import { LEDGER_TRANSACTION_LIST_COPY } from "./copy";
import { BudgetLedgerTransactionType } from "@/lib/firebase/schema/budget-ledger-transactions";
import type { BudgetLedgerTransaction } from "@/lib/firebase/schema/budget-ledger-transactions";

afterEach(cleanup);

function makeTransaction(
  overrides: Partial<BudgetLedgerTransaction> = {},
): BudgetLedgerTransaction {
  return {
    id: "tx-1",
    ledgerId: "ledger-1",
    type: BudgetLedgerTransactionType.Deposit,
    date: new Date("2024-01-01T00:00:00.000Z"),
    amount: 100,
    description: "Initial deposit",
    ...overrides,
  };
}

describe("LedgerTransactionListView", () => {
  describe("empty state", () => {
    it("renders the empty state message when there are no transactions", () => {
      render(
        <LedgerTransactionListView
          ledgerName="Test Ledger"
          transactions={[]}
          isLoading={false}
        />,
      );
      expect(
        screen.getByText(LEDGER_TRANSACTION_LIST_COPY.emptyStateMessage),
      ).toBeDefined();
    });
  });

  describe("loading state", () => {
    it("does not render the empty state message while loading", () => {
      render(
        <LedgerTransactionListView
          ledgerName="Test Ledger"
          transactions={[]}
          isLoading={true}
        />,
      );
      expect(
        screen.queryByText(LEDGER_TRANSACTION_LIST_COPY.emptyStateMessage),
      ).toBeNull();
    });
  });

  describe("ledger name", () => {
    it("renders the ledger name in the header", () => {
      render(
        <LedgerTransactionListView
          ledgerName="My Savings"
          transactions={[]}
          isLoading={false}
        />,
      );
      expect(screen.getByText("My Savings")).toBeDefined();
    });
  });

  describe("running balance calculation", () => {
    it("calculates running balance chronologically from oldest to newest", () => {
      const transactions = [
        makeTransaction({
          id: "tx-1",
          type: BudgetLedgerTransactionType.Deposit,
          amount: 500,
          date: new Date("2024-01-01T00:00:00.000Z"),
          description: "Paycheck",
        }),
        makeTransaction({
          id: "tx-2",
          type: BudgetLedgerTransactionType.Expense,
          amount: 150,
          date: new Date("2024-01-02T00:00:00.000Z"),
          description: "Groceries",
        }),
        makeTransaction({
          id: "tx-3",
          type: BudgetLedgerTransactionType.Deposit,
          amount: 75,
          date: new Date("2024-01-03T00:00:00.000Z"),
          description: "Bonus",
        }),
      ];

      render(
        <LedgerTransactionListView
          ledgerName="Test Ledger"
          transactions={transactions}
          isLoading={false}
        />,
      );

      // After first deposit of 500: balance = $500.00 (same as amount; check via getAllByText)
      // After expense of 150: balance = $350.00
      // After second deposit of 75: balance = $425.00
      expect(screen.getAllByText("$500.00").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("$350.00")).toBeDefined();
      expect(screen.getByText("$425.00")).toBeDefined();
    });

    it("orders transactions chronologically regardless of input order", () => {
      const transactions = [
        makeTransaction({
          id: "tx-later",
          type: BudgetLedgerTransactionType.Deposit,
          amount: 200,
          date: new Date("2024-01-03T00:00:00.000Z"),
          description: "Later",
        }),
        makeTransaction({
          id: "tx-earlier",
          type: BudgetLedgerTransactionType.Deposit,
          amount: 300,
          date: new Date("2024-01-01T00:00:00.000Z"),
          description: "Earlier",
        }),
      ];

      render(
        <LedgerTransactionListView
          ledgerName="Test Ledger"
          transactions={transactions}
          isLoading={false}
        />,
      );

      const rows = screen.getAllByRole("row");
      // Header row + 2 data rows (header is index 0)
      // Earlier transaction should appear first (oldest first)
      expect(rows[1]?.textContent).toContain("Earlier");
      expect(rows[2]?.textContent).toContain("Later");
    });

    it("treats expense transactions as subtractions from the running balance", () => {
      const transactions = [
        makeTransaction({
          id: "tx-1",
          type: BudgetLedgerTransactionType.Deposit,
          amount: 1000,
          date: new Date("2024-01-01T00:00:00.000Z"),
          description: "Income",
        }),
        makeTransaction({
          id: "tx-2",
          type: BudgetLedgerTransactionType.Expense,
          amount: 375,
          date: new Date("2024-01-02T00:00:00.000Z"),
          description: "Rent",
        }),
      ];

      render(
        <LedgerTransactionListView
          ledgerName="Test Ledger"
          transactions={transactions}
          isLoading={false}
        />,
      );

      // After deposit of 1000: balance = $1,000.00 (same as amount; check via getAllByText)
      // After expense of 375: balance = $625.00
      expect(screen.getAllByText("$1,000.00").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("$625.00")).toBeDefined();
    });
  });

  describe("transaction row content", () => {
    it("renders the transaction description", () => {
      const transactions = [makeTransaction({ description: "Electric bill" })];

      render(
        <LedgerTransactionListView
          ledgerName="Test Ledger"
          transactions={transactions}
          isLoading={false}
        />,
      );

      expect(screen.getByText("Electric bill")).toBeDefined();
    });

    it("renders the transaction type label for a deposit", () => {
      const transactions = [
        makeTransaction({ type: BudgetLedgerTransactionType.Deposit }),
      ];

      render(
        <LedgerTransactionListView
          ledgerName="Test Ledger"
          transactions={transactions}
          isLoading={false}
        />,
      );

      expect(
        screen.getByText(LEDGER_TRANSACTION_LIST_COPY.typeDeposit),
      ).toBeDefined();
    });

    it("renders the transaction type label for an expense", () => {
      const transactions = [
        makeTransaction({ type: BudgetLedgerTransactionType.Expense }),
      ];

      render(
        <LedgerTransactionListView
          ledgerName="Test Ledger"
          transactions={transactions}
          isLoading={false}
        />,
      );

      expect(
        screen.getByText(LEDGER_TRANSACTION_LIST_COPY.typeExpense),
      ).toBeDefined();
    });
  });
});
