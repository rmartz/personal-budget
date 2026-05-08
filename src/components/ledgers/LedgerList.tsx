"use client";

import type { Ledger, UpdateLedgerInput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Bar } from "@/components/ui/bar";
import { LedgerListItem } from "./LedgerListItem";
import { LEDGERS_PAGE_COPY } from "./copy";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface LedgerListProps {
  ledgers: Ledger[];
  isLoading: boolean;
  onNewLedger: () => void;
  onEditLedger: (id: string, data: UpdateLedgerInput) => Promise<void>;
  onDeleteLedger: (id: string) => void;
}

export function LedgerList({
  ledgers,
  isLoading,
  onNewLedger,
  onEditLedger,
  onDeleteLedger,
}: LedgerListProps) {
  const totalCash = ledgers.reduce((sum, l) => sum + l.cashBalance, 0);
  const totalInvested = ledgers.reduce(
    (sum, l) => sum + l.investmentBalance,
    0,
  );
  const totalBalance = totalCash + totalInvested;

  const summaryLine = LEDGERS_PAGE_COPY.headerSummary(
    ledgers.length,
    currencyFormatter.format(totalCash),
    currencyFormatter.format(totalInvested),
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {LEDGERS_PAGE_COPY.title}
          </h1>
          {!isLoading && (
            <p className="mt-1 text-sm text-muted-foreground">{summaryLine}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
          <Button variant="outline" onClick={() => {}}>
            {LEDGERS_PAGE_COPY.importButton}
          </Button>
          <Button onClick={onNewLedger}>
            {LEDGERS_PAGE_COPY.newLedgerButton}
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <Card>
          <div className="flex flex-col gap-2 p-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </Card>
      ) : ledgers.length === 0 ? (
        /* Empty state */
        <p className="py-8 text-center text-zinc-500 dark:text-zinc-400">
          {LEDGERS_PAGE_COPY.emptyStateMessage}
        </p>
      ) : (
        <>
          {/* Desktop table — hidden on mobile */}
          <Card className="hidden overflow-hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <th className="w-[30%] px-4 py-3">
                    {LEDGERS_PAGE_COPY.columnLedger}
                  </th>
                  <th className="px-4 py-3 text-right">
                    {LEDGERS_PAGE_COPY.columnCash}
                  </th>
                  <th className="px-4 py-3 text-right">
                    {LEDGERS_PAGE_COPY.columnInvestment}
                  </th>
                  <th className="w-[25%] px-4 py-3">
                    {LEDGERS_PAGE_COPY.columnCapUsage}
                  </th>
                  <th className="px-4 py-3 text-right">
                    {LEDGERS_PAGE_COPY.columnTotal}
                  </th>
                  <th className="px-4 py-3 text-right">
                    {LEDGERS_PAGE_COPY.columnGoals}
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {ledgers.map((ledger) => (
                  <LedgerListItem
                    key={ledger.id}
                    ledger={ledger}
                    onEdit={onEditLedger}
                    onDelete={onDeleteLedger}
                  />
                ))}
              </tbody>
            </table>
          </Card>

          {/* Mobile layout — hidden on desktop */}
          <div className="md:hidden">
            {/* Hero row */}
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {LEDGERS_PAGE_COPY.mobileTotalLabel}
                </p>
                <p className="font-mono text-3xl font-semibold">
                  {currencyFormatter.format(totalBalance)}
                </p>
              </div>
              <span className="rounded-full border px-3 py-1 text-sm text-muted-foreground">
                {ledgers.length} {ledgers.length === 1 ? "ledger" : "ledgers"}
              </span>
            </div>

            {/* Card list */}
            <Card className="overflow-hidden">
              <ul>
                {ledgers.map((ledger, index) => {
                  const ledgerTotal =
                    ledger.cashBalance + ledger.investmentBalance;
                  const capUsagePercent =
                    ledger.cashCap != null && ledger.cashCap > 0
                      ? (ledger.cashBalance / ledger.cashCap) * 100
                      : 0;

                  return (
                    <li
                      key={ledger.id}
                      className={`flex items-center justify-between px-4 py-3 ${
                        index < ledgers.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{ledger.name}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {currencyFormatter.format(ledger.cashBalance)} cash
                          {ledger.investmentBalance > 0 &&
                            ` · ${currencyFormatter.format(ledger.investmentBalance)} inv`}
                        </span>
                        {ledger.cashCap != null && (
                          <Bar
                            value={capUsagePercent}
                            className="max-w-[120px]"
                            aria-label={LEDGERS_PAGE_COPY.capUsageBarLabel(
                              ledger.name,
                            )}
                          />
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-mono text-sm font-medium">
                          {currencyFormatter.format(ledgerTotal)}
                        </span>
                        {!!ledger.goalsCount && (
                          <span className="text-xs text-muted-foreground">
                            {ledger.goalsCount}{" "}
                            {ledger.goalsCount === 1 ? "goal" : "goals"}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>

            {/* Sticky footer */}
            <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
              <Button className="h-11 w-full" onClick={onNewLedger}>
                {LEDGERS_PAGE_COPY.newLedgerButton}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
