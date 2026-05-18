"use client";

import type { TierTransfer } from "@/lib/reconciliation/tier-transfers";

import { RECONCILE_TIER_TRANSFERS_VIEW_COPY } from "./ReconcileTierTransfersView.copy";

export interface ReconcileTierTransfersViewProps {
  transfers: TierTransfer[];
}

export function ReconcileTierTransfersView({
  transfers,
}: ReconcileTierTransfersViewProps) {
  return transfers.length === 0 ? (
    <p className="text-sm text-muted-foreground">
      {RECONCILE_TIER_TRANSFERS_VIEW_COPY.emptyState}
    </p>
  ) : (
    <ul className="space-y-2">
      {transfers.map((transfer, index) => {
        const fromLabel =
          RECONCILE_TIER_TRANSFERS_VIEW_COPY.tierLabel[transfer.from];
        const toLabel =
          RECONCILE_TIER_TRANSFERS_VIEW_COPY.tierLabel[transfer.to];
        return (
          <li
            key={index}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <span>
              {fromLabel} {RECONCILE_TIER_TRANSFERS_VIEW_COPY.transferArrow}{" "}
              {toLabel}
            </span>
            <span className="font-medium tabular-nums">
              ${transfer.amount.toLocaleString()}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
