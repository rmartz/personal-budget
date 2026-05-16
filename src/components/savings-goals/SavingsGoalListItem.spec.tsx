import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

import { SAVINGS_GOAL_LIST_ITEM_COPY } from "./copy";
import {
  SavingsGoalListItem,
  SavingsGoalListItemView,
} from "./SavingsGoalListItem";

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

describe("A delete action is available on each goal row", () => {
  it("renders an overflow menu button", () => {
    const goal = makeSavingsGoal();
    render(
      <table>
        <tbody>
          <SavingsGoalListItemView
            goal={goal}
            deleteDialogOpen={false}
            isFirst={true}
            isLast={true}
            prevGoalId={undefined}
            nextGoalId={undefined}
            onDeleteDialogOpenChange={vi.fn()}
            onDeleteMenuClick={vi.fn()}
            onDeleteConfirm={vi.fn()}
            onEdit={noop}
            onReorder={noop}
          />
        </tbody>
      </table>,
    );
    expect(
      screen.getByRole("button", {
        name: SAVINGS_GOAL_LIST_ITEM_COPY.overflowMenuLabel,
      }),
    ).toBeDefined();
  });

  it("renders a delete option in the overflow menu", async () => {
    const goal = makeSavingsGoal();
    render(
      <table>
        <tbody>
          <SavingsGoalListItemView
            goal={goal}
            deleteDialogOpen={false}
            isFirst={true}
            isLast={true}
            prevGoalId={undefined}
            nextGoalId={undefined}
            onDeleteDialogOpenChange={vi.fn()}
            onDeleteMenuClick={vi.fn()}
            onDeleteConfirm={vi.fn()}
            onEdit={noop}
            onReorder={noop}
          />
        </tbody>
      </table>,
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: SAVINGS_GOAL_LIST_ITEM_COPY.overflowMenuLabel,
      }),
    );
    const deleteMenuItem = await screen.findByText(
      SAVINGS_GOAL_LIST_ITEM_COPY.deleteMenuLabel,
    );
    expect(deleteMenuItem).toBeDefined();
  });
});

describe("A confirmation dialog warns the user that funded progress will be lost", () => {
  it("shows the confirmation dialog title when delete is selected", async () => {
    const goal = makeSavingsGoal();
    render(
      <table>
        <tbody>
          <SavingsGoalListItem
            goal={goal}
            isFirst={true}
            isLast={true}
            prevGoalId={undefined}
            nextGoalId={undefined}
            onDelete={vi.fn()}
            onEdit={noop}
            onReorder={noop}
          />
        </tbody>
      </table>,
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: SAVINGS_GOAL_LIST_ITEM_COPY.overflowMenuLabel,
      }),
    );
    const deleteMenuItem = await screen.findByText(
      SAVINGS_GOAL_LIST_ITEM_COPY.deleteMenuLabel,
    );
    fireEvent.click(deleteMenuItem);
    expect(
      screen.getByText(SAVINGS_GOAL_LIST_ITEM_COPY.deleteConfirmTitle),
    ).toBeDefined();
  });

  it("shows a warning about funded progress being lost in the dialog", async () => {
    const goal = makeSavingsGoal({ fundedAmount: 1000 });
    render(
      <table>
        <tbody>
          <SavingsGoalListItem
            goal={goal}
            isFirst={true}
            isLast={true}
            prevGoalId={undefined}
            nextGoalId={undefined}
            onDelete={vi.fn()}
            onEdit={noop}
            onReorder={noop}
          />
        </tbody>
      </table>,
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: SAVINGS_GOAL_LIST_ITEM_COPY.overflowMenuLabel,
      }),
    );
    const deleteMenuItem = await screen.findByText(
      SAVINGS_GOAL_LIST_ITEM_COPY.deleteMenuLabel,
    );
    fireEvent.click(deleteMenuItem);
    expect(
      screen.getByText(SAVINGS_GOAL_LIST_ITEM_COPY.deleteConfirmDescription),
    ).toBeDefined();
  });
});

describe("Confirming deletes the goal via the service layer", () => {
  it("calls onDelete with the goal id when the confirm button is clicked", async () => {
    const onDelete = vi.fn();
    const goal = makeSavingsGoal({ id: "goal-abc" });
    render(
      <table>
        <tbody>
          <SavingsGoalListItem
            goal={goal}
            isFirst={true}
            isLast={true}
            prevGoalId={undefined}
            nextGoalId={undefined}
            onDelete={onDelete}
            onEdit={noop}
            onReorder={noop}
          />
        </tbody>
      </table>,
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: SAVINGS_GOAL_LIST_ITEM_COPY.overflowMenuLabel,
      }),
    );
    const deleteMenuItem = await screen.findByText(
      SAVINGS_GOAL_LIST_ITEM_COPY.deleteMenuLabel,
    );
    fireEvent.click(deleteMenuItem);
    fireEvent.click(
      screen.getByText(SAVINGS_GOAL_LIST_ITEM_COPY.deleteConfirmButton),
    );
    expect(onDelete).toHaveBeenCalledWith("goal-abc");
  });

  it("does not call onDelete when Cancel is clicked", async () => {
    const onDelete = vi.fn();
    const goal = makeSavingsGoal();
    render(
      <table>
        <tbody>
          <SavingsGoalListItem
            goal={goal}
            isFirst={true}
            isLast={true}
            prevGoalId={undefined}
            nextGoalId={undefined}
            onDelete={onDelete}
            onEdit={noop}
            onReorder={noop}
          />
        </tbody>
      </table>,
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: SAVINGS_GOAL_LIST_ITEM_COPY.overflowMenuLabel,
      }),
    );
    const deleteMenuItem = await screen.findByText(
      SAVINGS_GOAL_LIST_ITEM_COPY.deleteMenuLabel,
    );
    fireEvent.click(deleteMenuItem);
    fireEvent.click(
      screen.getByText(SAVINGS_GOAL_LIST_ITEM_COPY.deleteCancelButton),
    );
    expect(onDelete).not.toHaveBeenCalled();
  });
});

describe("When fundedAmount >= targetAmount, progress displays as fully funded", () => {
  it("shows the funded label when fundedAmount equals targetAmount", () => {
    const goal = makeSavingsGoal({ fundedAmount: 5000, targetAmount: 5000 });
    render(
      <table>
        <tbody>
          <SavingsGoalListItemView
            goal={goal}
            deleteDialogOpen={false}
            isFirst={true}
            isLast={true}
            prevGoalId={undefined}
            nextGoalId={undefined}
            onDeleteDialogOpenChange={vi.fn()}
            onDeleteMenuClick={vi.fn()}
            onDeleteConfirm={vi.fn()}
            onEdit={noop}
            onReorder={noop}
          />
        </tbody>
      </table>,
    );
    expect(
      screen.getByText(SAVINGS_GOAL_LIST_ITEM_COPY.fundedLabel),
    ).toBeDefined();
  });

  it("shows the funded label when fundedAmount exceeds targetAmount", () => {
    const goal = makeSavingsGoal({ fundedAmount: 5500, targetAmount: 5000 });
    render(
      <table>
        <tbody>
          <SavingsGoalListItemView
            goal={goal}
            deleteDialogOpen={false}
            isFirst={true}
            isLast={true}
            prevGoalId={undefined}
            nextGoalId={undefined}
            onDeleteDialogOpenChange={vi.fn()}
            onDeleteMenuClick={vi.fn()}
            onDeleteConfirm={vi.fn()}
            onEdit={noop}
            onReorder={noop}
          />
        </tbody>
      </table>,
    );
    expect(
      screen.getByText(SAVINGS_GOAL_LIST_ITEM_COPY.fundedLabel),
    ).toBeDefined();
  });

  it("does not display a raw percentage above 100 when overfunded", () => {
    const goal = makeSavingsGoal({ fundedAmount: 5500, targetAmount: 5000 });
    render(
      <table>
        <tbody>
          <SavingsGoalListItemView
            goal={goal}
            deleteDialogOpen={false}
            isFirst={true}
            isLast={true}
            prevGoalId={undefined}
            nextGoalId={undefined}
            onDeleteDialogOpenChange={vi.fn()}
            onDeleteMenuClick={vi.fn()}
            onDeleteConfirm={vi.fn()}
            onEdit={noop}
            onReorder={noop}
          />
        </tbody>
      </table>,
    );
    expect(screen.queryByText("110%")).toBeNull();
  });
});

describe("dropdownOpen prop controls the dropdown menu open state statically", () => {
  it("shows the delete menu item immediately when dropdownOpen is true", () => {
    const goal = makeSavingsGoal();
    render(
      <table>
        <tbody>
          <SavingsGoalListItemView
            goal={goal}
            deleteDialogOpen={false}
            dropdownOpen={true}
            isFirst={true}
            isLast={true}
            prevGoalId={undefined}
            nextGoalId={undefined}
            onDeleteDialogOpenChange={vi.fn()}
            onDeleteMenuClick={vi.fn()}
            onDeleteConfirm={vi.fn()}
            onEdit={noop}
            onReorder={noop}
          />
        </tbody>
      </table>,
    );
    expect(
      screen.getByText(SAVINGS_GOAL_LIST_ITEM_COPY.deleteMenuLabel),
    ).toBeDefined();
  });

  it("does not show the delete menu item when dropdownOpen is false", () => {
    const goal = makeSavingsGoal();
    render(
      <table>
        <tbody>
          <SavingsGoalListItemView
            goal={goal}
            deleteDialogOpen={false}
            dropdownOpen={false}
            isFirst={true}
            isLast={true}
            prevGoalId={undefined}
            nextGoalId={undefined}
            onDeleteDialogOpenChange={vi.fn()}
            onDeleteMenuClick={vi.fn()}
            onDeleteConfirm={vi.fn()}
            onEdit={noop}
            onReorder={noop}
          />
        </tbody>
      </table>,
    );
    expect(
      screen.queryByText(SAVINGS_GOAL_LIST_ITEM_COPY.deleteMenuLabel),
    ).toBeNull();
  });

  it("omitting dropdownOpen leaves menu closed by default", () => {
    const goal = makeSavingsGoal();
    render(
      <table>
        <tbody>
          <SavingsGoalListItemView
            goal={goal}
            deleteDialogOpen={false}
            isFirst={true}
            isLast={true}
            prevGoalId={undefined}
            nextGoalId={undefined}
            onDeleteDialogOpenChange={vi.fn()}
            onDeleteMenuClick={vi.fn()}
            onDeleteConfirm={vi.fn()}
            onEdit={noop}
            onReorder={noop}
          />
        </tbody>
      </table>,
    );
    expect(
      screen.queryByText(SAVINGS_GOAL_LIST_ITEM_COPY.deleteMenuLabel),
    ).toBeNull();
  });
});
