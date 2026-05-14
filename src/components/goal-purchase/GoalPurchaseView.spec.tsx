import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { GoalPurchaseView } from "./GoalPurchaseView";
import { GOAL_PURCHASE_VIEW_COPY } from "./copy";
import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

afterEach(cleanup);

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

describe("GoalPurchaseView — header", () => {
  describe("renders the goal name in the header", () => {
    it("shows the goal name alongside the header prefix", () => {
      render(
        <GoalPurchaseView
          goal={makeGoal({ name: "New Laptop" })}
          ledgerName="Tech Fund"
          siblingGoals={[]}
          onSubmit={vi.fn()}
        />,
      );
      expect(screen.getByText(/New Laptop/)).toBeDefined();
      expect(
        screen.getByText(GOAL_PURCHASE_VIEW_COPY.headerPrefix),
      ).toBeDefined();
    });
  });

  describe("renders the ledger name and target in the summary line", () => {
    it("shows the ledger name and target in the summary line", () => {
      render(
        <GoalPurchaseView
          goal={makeGoal({ targetAmount: 10000 })}
          ledgerName="Primary"
          siblingGoals={[]}
          onSubmit={vi.fn()}
        />,
      );
      expect(
        screen.getByText(
          GOAL_PURCHASE_VIEW_COPY.headerSummary("Primary", "$10,000.00"),
        ),
      ).toBeDefined();
    });
  });
});

describe("GoalPurchaseView — panels", () => {
  describe("renders the warning panel", () => {
    it("shows the insufficient cash warning headline", () => {
      render(
        <GoalPurchaseView
          goal={makeGoal()}
          ledgerName="Primary"
          siblingGoals={[]}
          onSubmit={vi.fn()}
        />,
      );
      expect(screen.getByText(/Insufficient cash/i)).toBeDefined();
    });
  });

  describe("renders the sibling projections panel", () => {
    it("shows the sibling goals section title", () => {
      render(
        <GoalPurchaseView
          goal={makeGoal()}
          ledgerName="Primary"
          siblingGoals={[makeGoal({ id: "g2", name: "Vacation" })]}
          onSubmit={vi.fn()}
        />,
      );
      expect(screen.getByText(/Sibling Goals/i)).toBeDefined();
    });
  });
});
