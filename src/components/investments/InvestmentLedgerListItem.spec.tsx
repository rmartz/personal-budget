import { describe, it, expect, afterEach, vi } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { InvestmentLedgerListItem } from "./InvestmentLedgerListItem";
import { INVESTMENT_LEDGER_LIST_COPY } from "./copy";
import type { InvestmentLedger } from "@/lib/types";

afterEach(cleanup);

function makeInvestmentLedger(
  overrides: Partial<InvestmentLedger> = {},
): InvestmentLedger {
  return {
    id: "test-id",
    name: "Test Ledger",
    currentBalance: 0,
    ...overrides,
  };
}

describe("InvestmentLedgerListItem", () => {
  it("renders the ledger name", () => {
    const ledger = makeInvestmentLedger({ name: "My Brokerage" });
    const { getByText } = render(
      <InvestmentLedgerListItem
        ledger={ledger}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(getByText("My Brokerage")).toBeDefined();
  });

  it("renders the balance formatted as currency", () => {
    const ledger = makeInvestmentLedger({ currentBalance: 12345.67 });
    const { getByText } = render(
      <InvestmentLedgerListItem
        ledger={ledger}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(getByText("$12,345.67")).toBeDefined();
  });

  it("labels the balance with the copy constant", () => {
    const ledger = makeInvestmentLedger({ currentBalance: 500 });
    const { getByRole } = render(
      <InvestmentLedgerListItem
        ledger={ledger}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(
      getByRole("generic", {
        name: INVESTMENT_LEDGER_LIST_COPY.currentBalanceLabel,
      }),
    ).toBeDefined();
  });

  it("calls onEdit with the ledger when the edit button is clicked", () => {
    const ledger = makeInvestmentLedger({ id: "abc", name: "Stocks" });
    const onEdit = vi.fn();
    const { getByText } = render(
      <InvestmentLedgerListItem
        ledger={ledger}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    );
    fireEvent.click(getByText(INVESTMENT_LEDGER_LIST_COPY.editAction));
    expect(onEdit).toHaveBeenCalledWith(ledger);
  });

  it("calls onDelete with the ledger when the delete button is clicked", () => {
    const ledger = makeInvestmentLedger({ id: "abc", name: "Stocks" });
    const onDelete = vi.fn();
    const { getByText } = render(
      <InvestmentLedgerListItem
        ledger={ledger}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    );
    fireEvent.click(getByText(INVESTMENT_LEDGER_LIST_COPY.deleteAction));
    expect(onDelete).toHaveBeenCalledWith(ledger);
  });
});
