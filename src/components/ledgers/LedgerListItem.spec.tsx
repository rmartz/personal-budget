import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Ledger } from "@/lib/types";

import { LEDGER_LIST_ITEM_COPY, LEDGERS_PAGE_COPY } from "./copy";
import { LedgerListItem, LedgerListItemView } from "./LedgerListItem";

afterEach(cleanup);

function makeLedger(overrides: Partial<Ledger> = {}): Ledger {
  return {
    id: "test-id",
    name: "Test Ledger",
    cashCap: undefined,
    cashBalance: 100,
    investmentBalance: 50,
    goalsCount: 0,
    ...overrides,
  };
}

describe("LedgerListItem", () => {
  const onDelete = vi.fn();
  const onEdit = vi.fn().mockResolvedValue(undefined);

  it("renders the ledger name", () => {
    const ledger = makeLedger({ name: "Everyday Spending" });
    render(
      <table>
        <tbody>
          <LedgerListItem ledger={ledger} onEdit={onEdit} onDelete={onDelete} />
        </tbody>
      </table>,
    );
    expect(screen.getByText("Everyday Spending")).toBeDefined();
  });

  it("renders the overflow menu button", () => {
    const ledger = makeLedger();
    render(
      <table>
        <tbody>
          <LedgerListItem ledger={ledger} onEdit={onEdit} onDelete={onDelete} />
        </tbody>
      </table>,
    );
    expect(
      screen.getByRole("button", {
        name: LEDGER_LIST_ITEM_COPY.overflowMenuLabel,
      }),
    ).toBeDefined();
  });

  describe("delete flow", () => {
    it("shows the confirmation dialog when Delete is selected from the overflow menu", async () => {
      const ledger = makeLedger({ name: "Test Ledger" });
      render(
        <table>
          <tbody>
            <LedgerListItem
              ledger={ledger}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </tbody>
        </table>,
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: LEDGER_LIST_ITEM_COPY.overflowMenuLabel,
        }),
      );

      const deleteMenuItem = await screen.findByText(
        LEDGER_LIST_ITEM_COPY.deleteMenuLabel,
      );
      fireEvent.click(deleteMenuItem);

      expect(
        screen.getByText(LEDGER_LIST_ITEM_COPY.deleteConfirmTitle),
      ).toBeDefined();
    });

    it("calls onDelete with the ledger id when the confirm button is clicked", async () => {
      const onDelete = vi.fn();
      const ledger = makeLedger({ id: "ledger-xyz" });
      render(
        <table>
          <tbody>
            <LedgerListItem
              ledger={ledger}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </tbody>
        </table>,
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: LEDGER_LIST_ITEM_COPY.overflowMenuLabel,
        }),
      );

      const deleteMenuItem = await screen.findByText(
        LEDGER_LIST_ITEM_COPY.deleteMenuLabel,
      );
      fireEvent.click(deleteMenuItem);
      fireEvent.click(
        screen.getByText(LEDGER_LIST_ITEM_COPY.deleteConfirmButton),
      );

      expect(onDelete).toHaveBeenCalledWith("ledger-xyz");
    });

    it("does not call onDelete when Cancel is clicked", async () => {
      const onDelete = vi.fn();
      const ledger = makeLedger();
      render(
        <table>
          <tbody>
            <LedgerListItem
              ledger={ledger}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </tbody>
        </table>,
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: LEDGER_LIST_ITEM_COPY.overflowMenuLabel,
        }),
      );

      const deleteMenuItem = await screen.findByText(
        LEDGER_LIST_ITEM_COPY.deleteMenuLabel,
      );
      fireEvent.click(deleteMenuItem);
      fireEvent.click(
        screen.getByText(LEDGER_LIST_ITEM_COPY.deleteCancelButton),
      );

      expect(onDelete).not.toHaveBeenCalled();
    });
  });
});

describe("LedgerListItemView", () => {
  const onEdit = vi.fn().mockResolvedValue(undefined);

  describe("cap usage column", () => {
    it("renders 'no cash cap' text when cashCap is undefined", () => {
      const ledger = makeLedger({ cashCap: undefined });
      render(
        <table>
          <tbody>
            <LedgerListItemView
              ledger={ledger}
              onEdit={onEdit}
              deleteDialogOpen={false}
              onDeleteDialogOpenChange={vi.fn()}
              onDeleteMenuClick={vi.fn()}
              onDeleteConfirm={vi.fn()}
            />
          </tbody>
        </table>,
      );
      expect(screen.getByText(LEDGERS_PAGE_COPY.noCashCapLabel)).toBeDefined();
    });

    it("does not render 'no cash cap' text when cashCap is set", () => {
      const ledger = makeLedger({ cashCap: 1000 });
      render(
        <table>
          <tbody>
            <LedgerListItemView
              ledger={ledger}
              onEdit={onEdit}
              deleteDialogOpen={false}
              onDeleteDialogOpenChange={vi.fn()}
              onDeleteMenuClick={vi.fn()}
              onDeleteConfirm={vi.fn()}
            />
          </tbody>
        </table>,
      );
      expect(screen.queryByText(LEDGERS_PAGE_COPY.noCashCapLabel)).toBeNull();
    });

    it("renders the cap usage progressbar with a descriptive accessible name", () => {
      const ledger = makeLedger({
        name: "Everyday Spending",
        cashCap: 1000,
        cashBalance: 750,
      });
      render(
        <table>
          <tbody>
            <LedgerListItemView
              ledger={ledger}
              onEdit={onEdit}
              deleteDialogOpen={false}
              onDeleteDialogOpenChange={vi.fn()}
              onDeleteMenuClick={vi.fn()}
              onDeleteConfirm={vi.fn()}
            />
          </tbody>
        </table>,
      );
      const bar = screen.getByRole("progressbar", {
        name: LEDGERS_PAGE_COPY.capUsageBarLabel("Everyday Spending"),
      });
      expect(bar).toBeDefined();
    });
  });

  describe("goals column", () => {
    it("renders em dash when goalsCount is 0", () => {
      const ledger = makeLedger({ goalsCount: 0 });
      render(
        <table>
          <tbody>
            <LedgerListItemView
              ledger={ledger}
              onEdit={onEdit}
              deleteDialogOpen={false}
              onDeleteDialogOpenChange={vi.fn()}
              onDeleteMenuClick={vi.fn()}
              onDeleteConfirm={vi.fn()}
            />
          </tbody>
        </table>,
      );
      const goalsCell = screen.getByTestId("goals-cell");
      expect(
        within(goalsCell).getByText(LEDGER_LIST_ITEM_COPY.goalsNone),
      ).toBeDefined();
    });

    it("renders the goals count when goalsCount is non-zero", () => {
      const ledger = makeLedger({ goalsCount: 3 });
      render(
        <table>
          <tbody>
            <LedgerListItemView
              ledger={ledger}
              onEdit={onEdit}
              deleteDialogOpen={false}
              onDeleteDialogOpenChange={vi.fn()}
              onDeleteMenuClick={vi.fn()}
              onDeleteConfirm={vi.fn()}
            />
          </tbody>
        </table>,
      );
      expect(screen.getByText("3")).toBeDefined();
    });
  });

  describe("activity column", () => {
    it("renders the activityNone placeholder", () => {
      const ledger = makeLedger();
      render(
        <table>
          <tbody>
            <LedgerListItemView
              ledger={ledger}
              onEdit={onEdit}
              deleteDialogOpen={false}
              onDeleteDialogOpenChange={vi.fn()}
              onDeleteMenuClick={vi.fn()}
              onDeleteConfirm={vi.fn()}
            />
          </tbody>
        </table>,
      );
      const activityCell = screen.getByRole("cell", {
        name: LEDGER_LIST_ITEM_COPY.activityNoneAriaLabel,
      });
      expect(
        within(activityCell).getByText(LEDGER_LIST_ITEM_COPY.activityNone),
      ).toBeDefined();
    });
  });
});
