import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { LedgerListItem } from "./LedgerListItem";
import { LEDGER_LIST_ITEM_COPY } from "./copy";
import type { Ledger } from "@/lib/types";

afterEach(cleanup);

function makeLedger(overrides: Partial<Ledger> = {}): Ledger {
  return {
    id: "test-id",
    name: "Test Ledger",
    cashCap: undefined,
    cashBalance: 100,
    investmentBalance: 50,
    ...overrides,
  };
}

describe("LedgerListItem", () => {
  it("renders the ledger name", () => {
    const ledger = makeLedger({ name: "Everyday Spending" });
    render(<LedgerListItem ledger={ledger} />);
    expect(screen.getByText("Everyday Spending")).toBeDefined();
  });

  it("renders the formatted total balance", () => {
    const ledger = makeLedger({ cashBalance: 1000, investmentBalance: 500 });
    render(<LedgerListItem ledger={ledger} />);
    expect(screen.getByText("$1,500.00")).toBeDefined();
  });

  it("renders the overflow menu button", () => {
    const ledger = makeLedger();
    render(<LedgerListItem ledger={ledger} />);
    expect(
      screen.getByRole("button", {
        name: LEDGER_LIST_ITEM_COPY.overflowMenuLabel,
      }),
    ).toBeDefined();
  });

  describe("delete flow", () => {
    it("shows the confirmation dialog when Delete is selected from the overflow menu", async () => {
      const ledger = makeLedger({ name: "Test Ledger" });
      render(<LedgerListItem ledger={ledger} />);

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
      expect(
        screen.getByText(LEDGER_LIST_ITEM_COPY.deleteConfirmDescription),
      ).toBeDefined();
    });

    it("calls onDelete with the ledger id when the confirm button is clicked", async () => {
      const onDelete = vi.fn();
      const ledger = makeLedger({ id: "ledger-xyz" });
      render(<LedgerListItem ledger={ledger} onDelete={onDelete} />);

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
      render(<LedgerListItem ledger={ledger} onDelete={onDelete} />);

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
