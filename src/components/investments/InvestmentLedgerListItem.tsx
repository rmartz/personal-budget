"use client";

import type { InvestmentLedger } from "@/lib/types";
import { INVESTMENT_LEDGER_LIST_COPY } from "./copy";

export interface InvestmentLedgerListItemProps {
  ledger: InvestmentLedger;
  onEdit: (ledger: InvestmentLedger) => void;
  onDelete: (ledger: InvestmentLedger) => void;
}

export function InvestmentLedgerListItem({
  ledger,
  onEdit,
  onDelete,
}: InvestmentLedgerListItemProps) {
  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(ledger.currentBalance);

  return (
    <div className="flex items-center justify-between rounded-lg border px-4 py-3">
      <span className="font-medium">{ledger.name}</span>
      <div className="flex items-center gap-3">
        <span
          aria-label={INVESTMENT_LEDGER_LIST_COPY.currentBalanceLabel}
          className="text-sm text-zinc-600 dark:text-zinc-400"
        >
          {formattedBalance}
        </span>
        <button
          type="button"
          onClick={() => {
            onEdit(ledger);
          }}
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          {INVESTMENT_LEDGER_LIST_COPY.editAction}
        </button>
        <button
          type="button"
          onClick={() => {
            onDelete(ledger);
          }}
          className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400"
        >
          {INVESTMENT_LEDGER_LIST_COPY.deleteAction}
        </button>
      </div>
    </div>
  );
}
