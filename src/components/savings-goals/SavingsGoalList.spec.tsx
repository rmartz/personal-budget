import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SavingsGoalListView } from "./SavingsGoalList";
import { SAVINGS_GOAL_LIST_COPY } from "./copy";
import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

afterEach(cleanup);

function makeSavingsGoal(
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

const noop = vi.fn().mockResolvedValue(undefined);

describe("SavingsGoalListView", () => {
  describe("Goals are listed in priority order (highest priority first)", () => {
    it("renders goals sorted by priority ascending (rank 1 first)", () => {
      const goals = [
        makeSavingsGoal({ id: "a", name: "Low Priority", priority: 3 }),
        makeSavingsGoal({ id: "b", name: "High Priority", priority: 1 }),
        makeSavingsGoal({ id: "c", name: "Mid Priority", priority: 2 }),
      ];
      render(
        <SavingsGoalListView goals={goals} onEdit={noop} onReorder={noop} />,
      );
      const [, firstRow, secondRow, thirdRow] = screen.getAllByRole("row");
      // rows[0] is the header row
      expect(firstRow?.textContent).toContain("High Priority");
      expect(secondRow?.textContent).toContain("Mid Priority");
      expect(thirdRow?.textContent).toContain("Low Priority");
    });
  });

  describe("Each row shows name, target amount, funded amount, progress percentage, priority rank", () => {
    it("renders the goal name", () => {
      const goals = [makeSavingsGoal({ name: "Vacation Fund" })];
      render(
        <SavingsGoalListView goals={goals} onEdit={noop} onReorder={noop} />,
      );
      expect(screen.getByText("Vacation Fund")).toBeDefined();
    });

    it("renders the target amount formatted as currency", () => {
      const goals = [makeSavingsGoal({ targetAmount: 5000 })];
      render(
        <SavingsGoalListView goals={goals} onEdit={noop} onReorder={noop} />,
      );
      expect(screen.getByText("$5,000.00")).toBeDefined();
    });

    it("renders the funded amount formatted as currency", () => {
      const goals = [makeSavingsGoal({ fundedAmount: 1250 })];
      render(
        <SavingsGoalListView goals={goals} onEdit={noop} onReorder={noop} />,
      );
      expect(screen.getByText("$1,250.00")).toBeDefined();
    });

    it("renders the progress percentage", () => {
      const goals = [
        makeSavingsGoal({ fundedAmount: 2500, targetAmount: 5000 }),
      ];
      render(
        <SavingsGoalListView goals={goals} onEdit={noop} onReorder={noop} />,
      );
      expect(screen.getByText("50%")).toBeDefined();
    });

    it("renders the priority rank", () => {
      const goals = [makeSavingsGoal({ priority: 2 })];
      render(
        <SavingsGoalListView goals={goals} onEdit={noop} onReorder={noop} />,
      );
      expect(screen.getByText("2")).toBeDefined();
    });
  });

  describe("Empty state prompts the user to create their first goal", () => {
    it("renders the empty state message when there are no goals", () => {
      render(<SavingsGoalListView goals={[]} onEdit={noop} onReorder={noop} />);
      expect(
        screen.getByText(SAVINGS_GOAL_LIST_COPY.emptyStateMessage),
      ).toBeDefined();
    });

    it("does not render the empty state message when goals exist", () => {
      render(
        <SavingsGoalListView
          goals={[makeSavingsGoal()]}
          onEdit={noop}
          onReorder={noop}
        />,
      );
      expect(
        screen.queryByText(SAVINGS_GOAL_LIST_COPY.emptyStateMessage),
      ).toBeNull();
    });
  });

  describe("Component tests verify progress display from fixture goals", () => {
    it("renders a progress bar for a partially funded goal", () => {
      const goals = [
        makeSavingsGoal({ fundedAmount: 1000, targetAmount: 5000 }),
      ];
      render(
        <SavingsGoalListView goals={goals} onEdit={noop} onReorder={noop} />,
      );
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toBeDefined();
      expect(Number(progressbar.getAttribute("aria-valuenow"))).toBe(20);
    });

    it("renders 100% progress and full funded amount for a fully funded goal", () => {
      const goals = [
        makeSavingsGoal({ fundedAmount: 5000, targetAmount: 5000 }),
      ];
      render(
        <SavingsGoalListView goals={goals} onEdit={noop} onReorder={noop} />,
      );
      expect(screen.getByText("100%")).toBeDefined();
      const progressbar = screen.getByRole("progressbar");
      expect(Number(progressbar.getAttribute("aria-valuenow"))).toBe(100);
    });

    it("renders 0% progress for an unfunded goal", () => {
      const goals = [makeSavingsGoal({ fundedAmount: 0, targetAmount: 5000 })];
      render(
        <SavingsGoalListView goals={goals} onEdit={noop} onReorder={noop} />,
      );
      expect(screen.getByText("0%")).toBeDefined();
    });
  });
});
