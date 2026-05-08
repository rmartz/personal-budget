import { describe, it, expect, afterEach, vi } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
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

describe("SavingsGoalListView — edit and reorder actions", () => {
  describe("An edit action on each goal row opens a pre-populated edit dialog", () => {
    it("renders an edit button for each goal row", () => {
      const goals = [
        makeSavingsGoal({ id: "a", name: "Goal A", priority: 1 }),
        makeSavingsGoal({ id: "b", name: "Goal B", priority: 2 }),
      ];
      const onEdit = vi.fn().mockResolvedValue(undefined);
      const onReorder = vi.fn().mockResolvedValue(undefined);
      render(
        <SavingsGoalListView
          goals={goals}
          onDelete={vi.fn()}
          onEdit={onEdit}
          onReorder={onReorder}
        />,
      );
      expect(
        screen.getAllByRole("button", { name: /edit/i }).length,
      ).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Priority can be reordered (up/down controls)", () => {
    it("renders a move-up button for goals that are not first in priority order", () => {
      const goals = [
        makeSavingsGoal({ id: "a", name: "First", priority: 1 }),
        makeSavingsGoal({ id: "b", name: "Second", priority: 2 }),
      ];
      const onEdit = vi.fn().mockResolvedValue(undefined);
      const onReorder = vi.fn().mockResolvedValue(undefined);
      render(
        <SavingsGoalListView
          goals={goals}
          onDelete={vi.fn()}
          onEdit={onEdit}
          onReorder={onReorder}
        />,
      );
      expect(
        screen.getByRole("button", {
          name: `${SAVINGS_GOAL_LIST_COPY.moveUpButton} Second`,
        }),
      ).toBeDefined();
    });

    it("does not render a move-up button for the first goal", () => {
      const goals = [
        makeSavingsGoal({ id: "a", name: "First", priority: 1 }),
        makeSavingsGoal({ id: "b", name: "Second", priority: 2 }),
      ];
      const onEdit = vi.fn().mockResolvedValue(undefined);
      const onReorder = vi.fn().mockResolvedValue(undefined);
      render(
        <SavingsGoalListView
          goals={goals}
          onDelete={vi.fn()}
          onEdit={onEdit}
          onReorder={onReorder}
        />,
      );
      expect(
        screen.queryByRole("button", {
          name: `${SAVINGS_GOAL_LIST_COPY.moveUpButton} First`,
        }),
      ).toBeNull();
    });

    it("renders a move-down button for goals that are not last in priority order", () => {
      const goals = [
        makeSavingsGoal({ id: "a", name: "First", priority: 1 }),
        makeSavingsGoal({ id: "b", name: "Second", priority: 2 }),
      ];
      const onEdit = vi.fn().mockResolvedValue(undefined);
      const onReorder = vi.fn().mockResolvedValue(undefined);
      render(
        <SavingsGoalListView
          goals={goals}
          onDelete={vi.fn()}
          onEdit={onEdit}
          onReorder={onReorder}
        />,
      );
      expect(
        screen.getByRole("button", {
          name: `${SAVINGS_GOAL_LIST_COPY.moveDownButton} First`,
        }),
      ).toBeDefined();
    });

    it("does not render a move-down button for the last goal", () => {
      const goals = [
        makeSavingsGoal({ id: "a", name: "First", priority: 1 }),
        makeSavingsGoal({ id: "b", name: "Second", priority: 2 }),
      ];
      const onEdit = vi.fn().mockResolvedValue(undefined);
      const onReorder = vi.fn().mockResolvedValue(undefined);
      render(
        <SavingsGoalListView
          goals={goals}
          onDelete={vi.fn()}
          onEdit={onEdit}
          onReorder={onReorder}
        />,
      );
      expect(
        screen.queryByRole("button", {
          name: `${SAVINGS_GOAL_LIST_COPY.moveDownButton} Second`,
        }),
      ).toBeNull();
    });

    it("calls onReorder with swapped priorities when move-up is clicked", async () => {
      const goalA = makeSavingsGoal({ id: "a", name: "First", priority: 1 });
      const goalB = makeSavingsGoal({ id: "b", name: "Second", priority: 2 });
      const onEdit = vi.fn().mockResolvedValue(undefined);
      const onReorder = vi.fn().mockResolvedValue(undefined);
      render(
        <SavingsGoalListView
          goals={[goalA, goalB]}
          onDelete={vi.fn()}
          onEdit={onEdit}
          onReorder={onReorder}
        />,
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: `${SAVINGS_GOAL_LIST_COPY.moveUpButton} Second`,
        }),
      );
      await waitFor(() => {
        expect(onReorder).toHaveBeenCalledWith("b", "a");
      });
    });

    it("calls onReorder with swapped priorities when move-down is clicked", async () => {
      const goalA = makeSavingsGoal({ id: "a", name: "First", priority: 1 });
      const goalB = makeSavingsGoal({ id: "b", name: "Second", priority: 2 });
      const onEdit = vi.fn().mockResolvedValue(undefined);
      const onReorder = vi.fn().mockResolvedValue(undefined);
      render(
        <SavingsGoalListView
          goals={[goalA, goalB]}
          onDelete={vi.fn()}
          onEdit={onEdit}
          onReorder={onReorder}
        />,
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: `${SAVINGS_GOAL_LIST_COPY.moveDownButton} First`,
        }),
      );
      await waitFor(() => {
        expect(onReorder).toHaveBeenCalledWith("a", "b");
      });
    });
  });
});
