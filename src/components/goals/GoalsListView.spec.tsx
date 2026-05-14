import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { GoalsListView } from "./GoalsListView";
import { GOALS_LIST_COPY } from "./copy";
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

const ledgerNames: Record<string, string> = {
  "ledger-1": "Primary",
  "ledger-2": "Savings",
};

describe("GoalsListView — title", () => {
  describe("renders the page title", () => {
    it("shows the Goals title", () => {
      render(
        <GoalsListView
          goals={[]}
          ledgerNames={ledgerNames}
          isLoading={false}
        />,
      );
      expect(screen.getByText(GOALS_LIST_COPY.title)).toBeDefined();
    });
  });
});

describe("GoalsListView — empty state", () => {
  describe("shows empty state when there are no goals", () => {
    it("renders the empty state message when goals array is empty", () => {
      render(
        <GoalsListView
          goals={[]}
          ledgerNames={ledgerNames}
          isLoading={false}
        />,
      );
      expect(screen.getByText(GOALS_LIST_COPY.emptyStateMessage)).toBeDefined();
    });

    it("does not render any goal links in empty state", () => {
      render(
        <GoalsListView
          goals={[]}
          ledgerNames={ledgerNames}
          isLoading={false}
        />,
      );
      expect(screen.queryAllByRole("link").length).toBe(0);
    });
  });
});

describe("GoalsListView — error state", () => {
  describe("shows error message when error is present", () => {
    it("renders the error message when error is provided", () => {
      render(
        <GoalsListView
          goals={[]}
          ledgerNames={ledgerNames}
          isLoading={false}
          error={new Error("Firebase permission denied")}
        />,
      );
      expect(screen.getByText(GOALS_LIST_COPY.errorMessage)).toBeDefined();
    });

    it("does not render the empty state when error is present", () => {
      render(
        <GoalsListView
          goals={[]}
          ledgerNames={ledgerNames}
          isLoading={false}
          error={new Error("Firebase permission denied")}
        />,
      );
      expect(screen.queryByText(GOALS_LIST_COPY.emptyStateMessage)).toBeNull();
    });
  });
});

describe("GoalsListView — populated state", () => {
  describe("renders a card for each goal", () => {
    it("renders goal names for all goals", () => {
      const goals = [
        makeGoal({ id: "g1", name: "Emergency Fund", ledgerId: "ledger-1" }),
        makeGoal({ id: "g2", name: "Vacation", ledgerId: "ledger-2" }),
      ];
      render(
        <GoalsListView
          goals={goals}
          ledgerNames={ledgerNames}
          isLoading={false}
        />,
      );
      expect(screen.getByText("Emergency Fund")).toBeDefined();
      expect(screen.getByText("Vacation")).toBeDefined();
    });

    it("does not render the empty state when goals exist", () => {
      render(
        <GoalsListView
          goals={[makeGoal()]}
          ledgerNames={ledgerNames}
          isLoading={false}
        />,
      );
      expect(screen.queryByText(GOALS_LIST_COPY.emptyStateMessage)).toBeNull();
    });
  });

  describe("does not show empty state while loading", () => {
    it("hides the empty state message while isLoading is true", () => {
      render(
        <GoalsListView goals={[]} ledgerNames={ledgerNames} isLoading={true} />,
      );
      expect(screen.queryByText(GOALS_LIST_COPY.emptyStateMessage)).toBeNull();
    });
  });
});
