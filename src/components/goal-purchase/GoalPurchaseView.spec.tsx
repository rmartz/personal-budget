import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

import { GOAL_PURCHASE_VIEW_COPY, GOAL_PURCHASE_WARNING_COPY } from "./copy";
import { GoalPurchaseView } from "./GoalPurchaseView";

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
          ledgerCashBalance={10000}
          ledgerName="Tech Fund"
          monthlyAllocation={500}
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
          ledgerCashBalance={20000}
          ledgerName="Primary"
          monthlyAllocation={500}
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
    it("shows the insufficient cash warning when ledger balance is below target", () => {
      render(
        <GoalPurchaseView
          goal={makeGoal({ targetAmount: 5000 })}
          ledgerCashBalance={0}
          ledgerName="Primary"
          monthlyAllocation={500}
          siblingGoals={[]}
          onSubmit={vi.fn()}
        />,
      );
      expect(screen.getByText(GOAL_PURCHASE_WARNING_COPY.title)).toBeDefined();
    });

    it("hides the insufficient cash warning when ledger balance meets the target", () => {
      render(
        <GoalPurchaseView
          goal={makeGoal({ targetAmount: 5000 })}
          ledgerCashBalance={5000}
          ledgerName="Primary"
          monthlyAllocation={500}
          siblingGoals={[]}
          onSubmit={vi.fn()}
        />,
      );
      expect(screen.queryByText(GOAL_PURCHASE_WARNING_COPY.title)).toBeNull();
    });
  });

  describe("renders the sibling projections panel", () => {
    it("shows the sibling goals section title", () => {
      render(
        <GoalPurchaseView
          goal={makeGoal()}
          ledgerCashBalance={10000}
          ledgerName="Primary"
          monthlyAllocation={500}
          siblingGoals={[makeGoal({ id: "g2", name: "Vacation" })]}
          onSubmit={vi.fn()}
        />,
      );
      expect(screen.getByText(/Sibling Goals/i)).toBeDefined();
    });
  });
});
