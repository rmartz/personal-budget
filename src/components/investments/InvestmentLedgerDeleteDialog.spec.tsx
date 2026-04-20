import { describe, it, expect, afterEach, vi } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { InvestmentLedgerDeleteDialog } from "./InvestmentLedgerDeleteDialog";
import { INVESTMENT_LEDGER_DELETE_DIALOG_COPY } from "./copy";
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

describe("InvestmentLedgerDeleteDialog", () => {
  it("renders the delete title", () => {
    const ledger = makeInvestmentLedger({ name: "Stocks" });
    const { getByText } = render(
      <InvestmentLedgerDeleteDialog
        open={true}
        onOpenChange={vi.fn()}
        ledger={ledger}
        onConfirm={vi.fn()}
      />,
    );
    expect(getByText(INVESTMENT_LEDGER_DELETE_DIALOG_COPY.title)).toBeDefined();
  });

  it("renders the description including the ledger name", () => {
    const ledger = makeInvestmentLedger({ name: "Stocks" });
    const { getByText } = render(
      <InvestmentLedgerDeleteDialog
        open={true}
        onOpenChange={vi.fn()}
        ledger={ledger}
        onConfirm={vi.fn()}
      />,
    );
    expect(
      getByText(INVESTMENT_LEDGER_DELETE_DIALOG_COPY.description("Stocks")),
    ).toBeDefined();
  });

  it("calls onConfirm when the delete button is clicked", () => {
    const ledger = makeInvestmentLedger({ name: "Stocks" });
    const onConfirm = vi.fn();
    const { getByText } = render(
      <InvestmentLedgerDeleteDialog
        open={true}
        onOpenChange={vi.fn()}
        ledger={ledger}
        onConfirm={onConfirm}
      />,
    );
    fireEvent.click(getByText(INVESTMENT_LEDGER_DELETE_DIALOG_COPY.confirm));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("renders nothing when open is false", () => {
    const ledger = makeInvestmentLedger({ name: "Stocks" });
    const { queryByText } = render(
      <InvestmentLedgerDeleteDialog
        open={false}
        onOpenChange={vi.fn()}
        ledger={ledger}
        onConfirm={vi.fn()}
      />,
    );
    expect(queryByText(INVESTMENT_LEDGER_DELETE_DIALOG_COPY.title)).toBeNull();
  });
});
