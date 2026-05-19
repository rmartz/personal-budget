import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

import { GOAL_SIBLING_PROJECTIONS_COPY } from "./copy";
import { GoalSiblingProjections } from "./GoalSiblingProjections";

afterEach(cleanup);

function makeGoal(
  overrides: Partial<BudgetLedgerSavingsGoal> = {},
): BudgetLedgerSavingsGoal {
  return {
    id: "goal-1",
    ledgerId: "ledger-1",
    name: "Emergency Fund",
    targetAmount: 1000,
    fundedAmount: 0,
    priority: 1,
    ...overrides,
  };
}

const purchasedGoal = makeGoal({
  id: "purchased",
  name: "Studio Display",
  priority: 1,
});

describe("GoalSiblingProjections — structure", () => {
  describe("renders the section title", () => {
    it("shows the sibling projections title", () => {
      render(
        <GoalSiblingProjections
          monthlyAllocation={500}
          purchasedGoal={purchasedGoal}
          siblingGoals={[]}
        />,
      );
      expect(
        screen.getByText(GOAL_SIBLING_PROJECTIONS_COPY.title),
      ).toBeDefined();
    });
  });

  describe("renders the footer note", () => {
    it("shows the footer text", () => {
      render(
        <GoalSiblingProjections
          monthlyAllocation={500}
          purchasedGoal={purchasedGoal}
          siblingGoals={[]}
        />,
      );
      expect(
        screen.getByText(GOAL_SIBLING_PROJECTIONS_COPY.footer),
      ).toBeDefined();
    });
  });
});

describe("GoalSiblingProjections — table", () => {
  describe("renders sibling goal rows", () => {
    it("shows each sibling goal name", () => {
      render(
        <GoalSiblingProjections
          monthlyAllocation={500}
          purchasedGoal={purchasedGoal}
          siblingGoals={[
            makeGoal({ id: "g2", name: "MacBook Pro", priority: 2 }),
            makeGoal({ id: "g3", name: "Keyboard", priority: 3 }),
          ]}
        />,
      );
      expect(screen.getByText("MacBook Pro")).toBeDefined();
      expect(screen.getByText("Keyboard")).toBeDefined();
    });

    it("shows projected ETA dates when monthly allocation is non-zero", () => {
      render(
        <GoalSiblingProjections
          monthlyAllocation={1200}
          purchasedGoal={purchasedGoal}
          siblingGoals={[
            makeGoal({
              id: "g2",
              name: "Vacation",
              priority: 2,
              targetAmount: 600,
              fundedAmount: 0,
            }),
          ]}
        />,
      );
      // With allocation, we should NOT see placeholder for both columns
      const placeholders = screen.queryAllByText(
        GOAL_SIBLING_PROJECTIONS_COPY.etaPlaceholder,
      );
      // Both ETAs should resolve to concrete dates — no placeholders expected
      expect(placeholders.length).toBe(0);
    });
  });

  describe("excludes fully-funded siblings from the New ETA denominator", () => {
    it("shows concrete ETAs for unfunded siblings when a fully-funded sibling is present", () => {
      // "Vacation" is unfunded; "Already Funded" is fully funded.
      // The unfunded sibling's ETA columns should show concrete dates.
      // The fully-funded sibling correctly returns undefined for both ETAs
      // (it needs no more funding), so exactly 2 placeholders total should appear —
      // one per ETA column for "Already Funded" only.
      render(
        <GoalSiblingProjections
          monthlyAllocation={1200}
          purchasedGoal={purchasedGoal}
          siblingGoals={[
            makeGoal({
              id: "g2",
              name: "Vacation",
              priority: 2,
              targetAmount: 600,
              fundedAmount: 0,
            }),
            makeGoal({
              id: "g3",
              name: "Already Funded",
              priority: 3,
              targetAmount: 500,
              fundedAmount: 500,
            }),
          ]}
        />,
      );
      // Exactly 2 placeholders: one per ETA column for the fully-funded sibling only
      const placeholders = screen.queryAllByText(
        GOAL_SIBLING_PROJECTIONS_COPY.etaPlaceholder,
      );
      expect(placeholders.length).toBe(2);
    });
  });

  describe("shows placeholder when monthly allocation is zero", () => {
    it("renders the placeholder in both ETA columns when allocation is 0", () => {
      render(
        <GoalSiblingProjections
          monthlyAllocation={0}
          purchasedGoal={purchasedGoal}
          siblingGoals={[makeGoal({ id: "g2", name: "Vacation", priority: 2 })]}
        />,
      );
      const placeholders = screen.queryAllByText(
        GOAL_SIBLING_PROJECTIONS_COPY.etaPlaceholder,
      );
      expect(placeholders.length).toBe(2);
    });
  });

  describe("hides the table when there are no sibling goals", () => {
    it("does not render column headers when siblingGoals is empty", () => {
      render(
        <GoalSiblingProjections
          monthlyAllocation={500}
          purchasedGoal={purchasedGoal}
          siblingGoals={[]}
        />,
      );
      expect(
        screen.queryByText(GOAL_SIBLING_PROJECTIONS_COPY.columnGoal),
      ).toBeNull();
    });
  });
});
