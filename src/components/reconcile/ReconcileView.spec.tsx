import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ReconcileView } from "./ReconcileView";
import { RECONCILE_VIEW_COPY } from "./ReconcileView.copy";

afterEach(cleanup);

describe("ReconcileView — page header", () => {
  it("renders the Reconcile heading", () => {
    render(<ReconcileView />);
    expect(
      screen.getByRole("heading", { name: RECONCILE_VIEW_COPY.pageHeading }),
    ).toBeDefined();
  });

  it("renders the tagline", () => {
    render(<ReconcileView />);
    expect(screen.getByText(RECONCILE_VIEW_COPY.tagline)).toBeDefined();
  });
});

describe("ReconcileView — summary tiles", () => {
  it("renders the Cash surplus tile", () => {
    render(<ReconcileView />);
    expect(screen.getByText(RECONCILE_VIEW_COPY.tileCashSurplus)).toBeDefined();
  });

  it("renders the To invest tile", () => {
    render(<ReconcileView />);
    expect(screen.getByText(RECONCILE_VIEW_COPY.tileToInvest)).toBeDefined();
  });

  it("renders the Inter-tier transfer tile", () => {
    render(<ReconcileView />);
    expect(
      screen.getByText(RECONCILE_VIEW_COPY.tileInterTierTransfer),
    ).toBeDefined();
  });

  it("renders the To assign to ledgers tile", () => {
    render(<ReconcileView />);
    expect(
      screen.getByText(RECONCILE_VIEW_COPY.tileAssignToLedgers),
    ).toBeDefined();
  });
});

describe("ReconcileView — inputs needed section", () => {
  it("renders the Inputs needed heading", () => {
    render(<ReconcileView />);
    expect(
      screen.getByText(RECONCILE_VIEW_COPY.inputsNeededHeading),
    ).toBeDefined();
  });
});

describe("ReconcileView — investment explanation panel", () => {
  it("renders the Why this investment amount? heading", () => {
    render(<ReconcileView />);
    expect(
      screen.getByText(RECONCILE_VIEW_COPY.investmentExplanationHeading),
    ).toBeDefined();
  });
});

describe("ReconcileView — New expense button", () => {
  it("renders the New expense button when onNewExpense is provided", () => {
    render(<ReconcileView onNewExpense={vi.fn()} />);
    expect(
      screen.getByText(RECONCILE_VIEW_COPY.actionNewExpense),
    ).toBeDefined();
  });

  it("does not render the New expense button when onNewExpense is undefined", () => {
    render(<ReconcileView />);
    expect(screen.queryByText(RECONCILE_VIEW_COPY.actionNewExpense)).toBeNull();
  });

  it("calls onNewExpense when the New expense button is clicked", () => {
    const onNewExpense = vi.fn();
    render(<ReconcileView onNewExpense={onNewExpense} />);
    fireEvent.click(screen.getByText(RECONCILE_VIEW_COPY.actionNewExpense));
    expect(onNewExpense).toHaveBeenCalled();
  });
});
