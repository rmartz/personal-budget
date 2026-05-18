import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";

import { ReconcileTierTransfersView } from "./ReconcileTierTransfersView";
import { RECONCILE_TIER_TRANSFERS_VIEW_COPY } from "./ReconcileTierTransfersView.copy";

afterEach(cleanup);

describe("ReconcileTierTransfersView — empty state", () => {
  it("shows the empty state message when transfers is empty", () => {
    render(<ReconcileTierTransfersView transfers={[]} />);
    expect(
      screen.getByText(RECONCILE_TIER_TRANSFERS_VIEW_COPY.emptyState),
    ).toBeDefined();
  });

  it("does not show the empty state message when transfers are provided", () => {
    render(
      <ReconcileTierTransfersView
        transfers={[
          {
            amount: 500,
            from: ReconciliationAccountTier.LongTerm,
            to: ReconciliationAccountTier.ShortTerm,
          },
        ]}
      />,
    );
    expect(
      screen.queryByText(RECONCILE_TIER_TRANSFERS_VIEW_COPY.emptyState),
    ).toBeNull();
  });
});

describe("ReconcileTierTransfersView — transfer display", () => {
  it("renders a row showing the from and to tier labels", () => {
    render(
      <ReconcileTierTransfersView
        transfers={[
          {
            amount: 1000,
            from: ReconciliationAccountTier.Reserve,
            to: ReconciliationAccountTier.ShortTerm,
          },
        ]}
      />,
    );
    expect(
      screen.getByText(
        `${RECONCILE_TIER_TRANSFERS_VIEW_COPY.tierLabel[ReconciliationAccountTier.Reserve]} ${RECONCILE_TIER_TRANSFERS_VIEW_COPY.transferArrow} ${RECONCILE_TIER_TRANSFERS_VIEW_COPY.tierLabel[ReconciliationAccountTier.ShortTerm]}`,
      ),
    ).toBeDefined();
  });

  it("renders the transfer amount formatted with a dollar sign", () => {
    render(
      <ReconcileTierTransfersView
        transfers={[
          {
            amount: 2500,
            from: ReconciliationAccountTier.LongTerm,
            to: ReconciliationAccountTier.Reserve,
          },
        ]}
      />,
    );
    expect(screen.getByText("$2,500")).toBeDefined();
  });

  it("renders one row per transfer", () => {
    render(
      <ReconcileTierTransfersView
        transfers={[
          {
            amount: 1000,
            from: ReconciliationAccountTier.ShortTerm,
            to: ReconciliationAccountTier.Reserve,
          },
          {
            amount: 500,
            from: ReconciliationAccountTier.Reserve,
            to: ReconciliationAccountTier.LongTerm,
          },
        ]}
      />,
    );
    expect(screen.getByText("$1,000")).toBeDefined();
    expect(screen.getByText("$500")).toBeDefined();
  });
});
