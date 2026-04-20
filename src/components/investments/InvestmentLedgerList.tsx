"use client";

import type { InvestmentLedger } from "@/lib/types";
import { InvestmentLedgerListItem } from "./InvestmentLedgerListItem";
import { INVESTMENT_LEDGER_LIST_COPY } from "./copy";

export interface InvestmentLedgerListProps {
  ledgers: InvestmentLedger[];
  isLoading: boolean;
  onNewLedger: () => void;
  onEditLedger: (ledger: InvestmentLedger) => void;
  onDeleteLedger: (ledger: InvestmentLedger) => void;
}

export function InvestmentLedgerList({
  ledgers,
  isLoading,
  onNewLedger,
  onEditLedger,
  onDeleteLedger,
}: InvestmentLedgerListProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {INVESTMENT_LEDGER_LIST_COPY.title}
        </h1>
        {ledgers.length > 0 && (
          <button
            type="button"
            onClick={onNewLedger}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {INVESTMENT_LEDGER_LIST_COPY.newLedgerButton}
          </button>
        )}
      </div>
      {isLoading ? (
        <div
          aria-label={INVESTMENT_LEDGER_LIST_COPY.loadingLabel}
          className="flex flex-col gap-2"
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg border bg-zinc-100 dark:bg-zinc-800"
            />
          ))}
        </div>
      ) : ledgers.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed px-6 py-12 text-center">
          <div className="flex flex-col gap-1">
            <p className="font-medium">
              {INVESTMENT_LEDGER_LIST_COPY.emptyStateHeading}
            </p>
            <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
              {INVESTMENT_LEDGER_LIST_COPY.emptyStateDescription}
            </p>
          </div>
          <button
            type="button"
            onClick={onNewLedger}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {INVESTMENT_LEDGER_LIST_COPY.newLedgerButton}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {ledgers.map((ledger) => (
            <InvestmentLedgerListItem
              key={ledger.id}
              ledger={ledger}
              onEdit={onEditLedger}
              onDelete={onDeleteLedger}
            />
          ))}
        </div>
      )}
    </div>
  );
}
