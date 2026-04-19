"use client";

import type { InvestmentLedger } from "@/lib/types";
import { INVESTMENT_LEDGER_LIST_COPY } from "./copy";

export interface InvestmentLedgerListItemProps {
  ledger: InvestmentLedger;
}

export function InvestmentLedgerListItem({
  ledger,
}: InvestmentLedgerListItemProps) {
  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(ledger.currentBalance);

  return (
    <div className="flex items-center justify-between rounded-lg border px-4 py-3">
      <span className="font-medium">{ledger.name}</span>
      <span
        aria-label={INVESTMENT_LEDGER_LIST_COPY.currentBalanceLabel}
        className="text-sm text-zinc-600 dark:text-zinc-400"
      >
        {formattedBalance}
      </span>
    </div>
  );
}
