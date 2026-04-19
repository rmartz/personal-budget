"use client";

import type { Ledger } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LedgerListItem } from "./LedgerListItem";
import { LEDGERS_PAGE_COPY } from "./copy";

interface LedgerListProps {
  ledgers: Ledger[];
  isLoading: boolean;
  onNewLedger: () => void;
}

export function LedgerList({
  ledgers,
  isLoading,
  onNewLedger,
}: LedgerListProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {LEDGERS_PAGE_COPY.title}
        </h1>
        <Button onClick={onNewLedger}>
          {LEDGERS_PAGE_COPY.newLedgerButton}
        </Button>
      </div>
      {isLoading ? (
        <ul className="flex flex-col gap-2">
          <li>
            <Skeleton className="h-12 w-full" />
          </li>
          <li>
            <Skeleton className="h-12 w-full" />
          </li>
          <li>
            <Skeleton className="h-12 w-full" />
          </li>
        </ul>
      ) : ledgers.length === 0 ? (
        <p className="py-8 text-center text-zinc-500 dark:text-zinc-400">
          {LEDGERS_PAGE_COPY.emptyStateMessage}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {ledgers.map((ledger) => (
            <LedgerListItem key={ledger.id} ledger={ledger} />
          ))}
        </ul>
      )}
    </div>
  );
}
