import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { LedgerDetailView } from "./LedgerDetailView";
import { LEDGER_DETAIL_COPY } from "./copy";
import type { Ledger } from "@/lib/types";
import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

afterEach(cleanup);

function makeLedger(overrides: Partial<Ledger> = {}): Ledger {
  return {
    id: "ledger-1",
    name: "Test Ledger",
    cashBalance: 500,
    investmentBalance: 200,
    cashCap: 1000,
    goalsCount: 0,
    ...overrides,
  };
}

function makeGoal(
  overrides: Partial<BudgetLedgerSavingsGoal> = {},
): BudgetLedgerSavingsGoal {
  return {
    id: "goal-1",
    ledgerId: "ledger-1",
    name: "Emergency Fund",
    targetAmount: 5000,
    fundedAmount: 1000,
    priority: 1,
    ...overrides,
  };
}

const baseProps = {
  transactions: [],
  savingsGoals: [],
  isLoading: false,
  onSaveLedger: vi.fn().mockResolvedValue(undefined),
  onAddExpense: vi.fn(),
  onAddDeposit: vi.fn(),
  onAddGoal: vi.fn(),
  onDeleteTransaction: vi.fn(),
  onEditTransaction: vi.fn(),
  onDeleteGoal: vi.fn(),
  onEditGoal: vi.fn().mockResolvedValue(undefined),
  onReorderGoal: vi.fn().mockResolvedValue(undefined),
};

describe("LedgerDetailView", () => {
  describe("breadcrumb", () => {
    it("renders a link back to /ledgers", () => {
      render(<LedgerDetailView {...baseProps} ledger={makeLedger()} />);
      const link = screen.getByRole("link", {
        name: LEDGER_DETAIL_COPY.breadcrumbParent,
      });
      expect(link).toBeDefined();
      expect(link.getAttribute("href")).toBe("/ledgers");
    });
  });

  describe("header", () => {
    it("renders the ledger name as heading", () => {
      render(
        <LedgerDetailView
          {...baseProps}
          ledger={makeLedger({ name: "Everyday Spending" })}
        />,
      );
      expect(screen.getAllByText("Everyday Spending").length).toBeGreaterThan(
        0,
      );
    });

    it("renders the edit ledger trigger button", () => {
      render(
        <LedgerDetailView
          {...baseProps}
          ledger={makeLedger({ name: "Test Ledger" })}
        />,
      );
      // EditLedgerDialog renders a trigger with aria-label "Edit {name}"
      expect(
        screen.getByRole("button", { name: /edit test ledger/i }),
      ).toBeDefined();
    });

    it("renders the Add Expense button", () => {
      render(<LedgerDetailView {...baseProps} ledger={makeLedger()} />);
      expect(
        screen.getAllByText(LEDGER_DETAIL_COPY.addExpenseButton).length,
      ).toBeGreaterThan(0);
    });

    it("renders the Add Deposit button", () => {
      render(<LedgerDetailView {...baseProps} ledger={makeLedger()} />);
      expect(
        screen.getAllByText(LEDGER_DETAIL_COPY.addDepositButton).length,
      ).toBeGreaterThan(0);
    });
  });

  describe("summary cards", () => {
    it("renders the total balance section title", () => {
      render(<LedgerDetailView {...baseProps} ledger={makeLedger()} />);
      expect(
        screen.getByText(LEDGER_DETAIL_COPY.totalSectionTitle),
      ).toBeDefined();
    });

    it("renders the total balance as cash plus investment", () => {
      render(
        <LedgerDetailView
          {...baseProps}
          ledger={makeLedger({ cashBalance: 300, investmentBalance: 700 })}
        />,
      );
      expect(screen.getByText("$1,000.00")).toBeDefined();
    });

    it("renders the cash/investment split section title", () => {
      render(<LedgerDetailView {...baseProps} ledger={makeLedger()} />);
      expect(
        screen.getByText(LEDGER_DETAIL_COPY.splitSectionTitle),
      ).toBeDefined();
    });

    it("renders the this-month section title", () => {
      render(<LedgerDetailView {...baseProps} ledger={makeLedger()} />);
      expect(
        screen.getByText(LEDGER_DETAIL_COPY.monthSectionTitle),
      ).toBeDefined();
    });
  });

  describe("goals section", () => {
    it("renders the goals section title", () => {
      render(<LedgerDetailView {...baseProps} ledger={makeLedger()} />);
      expect(
        screen.getByText(LEDGER_DETAIL_COPY.goalsSectionTitle),
      ).toBeDefined();
    });

    it("renders the Add Goal button", () => {
      render(<LedgerDetailView {...baseProps} ledger={makeLedger()} />);
      expect(
        screen.getByRole("button", { name: LEDGER_DETAIL_COPY.addGoalButton }),
      ).toBeDefined();
    });

    it("renders goal names from savingsGoals prop", () => {
      const goals = [
        makeGoal({ id: "g1", name: "Emergency Fund" }),
        makeGoal({ id: "g2", name: "Vacation" }),
      ];
      render(
        <LedgerDetailView
          {...baseProps}
          ledger={makeLedger()}
          savingsGoals={goals}
        />,
      );
      expect(screen.getByText("Emergency Fund")).toBeDefined();
      expect(screen.getByText("Vacation")).toBeDefined();
    });
  });
});
