import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { GoalCard } from "./GoalCard";
import { GOAL_CARD_COPY, GOALS_LIST_COPY } from "./copy";
import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

afterEach(cleanup);

function makeGoal(
  overrides: Partial<BudgetLedgerSavingsGoal> = {},
): BudgetLedgerSavingsGoal {
  return {
    id: "goal-abc",
    ledgerId: "ledger-1",
    name: "Emergency Fund",
    targetAmount: 5000,
    fundedAmount: 1000,
    priority: 2,
    ...overrides,
  };
}

describe("GoalCard — content", () => {
  describe("renders the goal name", () => {
    it("shows the goal name prominently", () => {
      render(
        <GoalCard goal={makeGoal({ name: "Vacation" })} ledgerName="Primary" />,
      );
      expect(screen.getByText("Vacation")).toBeDefined();
    });
  });

  describe("renders the ledger name in the eyebrow", () => {
    it("shows the ledger name in upper case in the eyebrow", () => {
      render(<GoalCard goal={makeGoal()} ledgerName="My Ledger" />);
      expect(screen.getByText(/MY LEDGER/)).toBeDefined();
    });
  });

  describe("renders the priority in the eyebrow", () => {
    it("shows P{n} for the priority number", () => {
      render(
        <GoalCard goal={makeGoal({ priority: 3 })} ledgerName="Primary" />,
      );
      expect(screen.getByText(/P3/)).toBeDefined();
    });
  });

  describe("renders funding amounts", () => {
    it("shows the funded amount formatted as currency", () => {
      render(
        <GoalCard
          goal={makeGoal({ fundedAmount: 2500 })}
          ledgerName="Primary"
        />,
      );
      expect(screen.getByText("$2,500.00")).toBeDefined();
    });

    it("shows the target amount via the ofTarget copy", () => {
      render(
        <GoalCard
          goal={makeGoal({ targetAmount: 10000 })}
          ledgerName="Primary"
        />,
      );
      expect(
        screen.getByText(GOAL_CARD_COPY.ofTarget("$10,000.00")),
      ).toBeDefined();
    });
  });

  describe("renders percent funded footer", () => {
    it("shows the funded percentage", () => {
      render(
        <GoalCard
          goal={makeGoal({ fundedAmount: 1000, targetAmount: 4000 })}
          ledgerName="Primary"
        />,
      );
      expect(screen.getByText(GOAL_CARD_COPY.fundedLabel(25))).toBeDefined();
    });
  });

  describe("renders 'Ready to purchase' when fully funded", () => {
    it("shows ready-to-purchase label when fundedAmount >= targetAmount", () => {
      render(
        <GoalCard
          goal={makeGoal({ fundedAmount: 5000, targetAmount: 5000 })}
          ledgerName="Primary"
        />,
      );
      expect(screen.getByText(GOALS_LIST_COPY.readyToPurchase)).toBeDefined();
    });

    it("does not show 'to go' label when fully funded", () => {
      render(
        <GoalCard
          goal={makeGoal({ fundedAmount: 5000, targetAmount: 5000 })}
          ledgerName="Primary"
        />,
      );
      expect(screen.queryByText(/to go/)).toBeNull();
    });
  });

  describe("renders amount-to-go when not fully funded", () => {
    it("shows '$Y to go' when fundedAmount < targetAmount", () => {
      render(
        <GoalCard
          goal={makeGoal({ fundedAmount: 1000, targetAmount: 5000 })}
          ledgerName="Primary"
        />,
      );
      expect(
        screen.getByText(GOAL_CARD_COPY.toGoLabel("$4,000.00")),
      ).toBeDefined();
    });
  });
});

describe("GoalCard — navigation", () => {
  describe("links to the purchase page", () => {
    it("contains an anchor linking to /goals/[goalId]/purchase", () => {
      render(
        <GoalCard goal={makeGoal({ id: "goal-abc" })} ledgerName="Primary" />,
      );
      const link = screen.getByRole("link");
      expect(link.getAttribute("href")).toBe("/goals/goal-abc/purchase");
    });
  });
});
