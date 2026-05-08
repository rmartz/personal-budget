"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import type { BudgetLedgerTransaction } from "@/lib/firebase/schema/budget-ledger-transactions";
import { BudgetLedgerTransactionType } from "@/lib/firebase/schema/budget-ledger-transactions";
import { LEDGER_TRANSACTION_LIST_COPY } from "./copy";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

interface TransactionWithBalance extends BudgetLedgerTransaction {
  runningBalance: number;
}

function computeRunningBalances(
  transactions: BudgetLedgerTransaction[],
): TransactionWithBalance[] {
  const sorted = [...transactions].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
  let balance = 0;
  return sorted.map((tx) => {
    balance =
      tx.type === BudgetLedgerTransactionType.Deposit
        ? balance + tx.amount
        : balance - tx.amount;
    return { ...tx, runningBalance: balance };
  });
}

export interface LedgerTransactionListViewProps {
  ledgerName: string;
  transactions: BudgetLedgerTransaction[];
  isLoading: boolean;
}

export function LedgerTransactionListView({
  ledgerName,
  transactions,
  isLoading,
}: LedgerTransactionListViewProps) {
  const transactionsWithBalance = computeRunningBalances(transactions);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{ledgerName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {LEDGER_TRANSACTION_LIST_COPY.title}
        </p>
      </div>

      {isLoading ? (
        <Card>
          <div className="flex flex-col gap-2 p-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </Card>
      ) : transactions.length === 0 ? (
        <p className="py-8 text-center text-zinc-500 dark:text-zinc-400">
          {LEDGER_TRANSACTION_LIST_COPY.emptyStateMessage}
        </p>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">
                  {LEDGER_TRANSACTION_LIST_COPY.columnDate}
                </th>
                <th className="px-4 py-3">
                  {LEDGER_TRANSACTION_LIST_COPY.columnType}
                </th>
                <th className="px-4 py-3">
                  {LEDGER_TRANSACTION_LIST_COPY.columnDescription}
                </th>
                <th className="px-4 py-3 text-right">
                  {LEDGER_TRANSACTION_LIST_COPY.columnAmount}
                </th>
                <th className="px-4 py-3 text-right">
                  {LEDGER_TRANSACTION_LIST_COPY.columnBalance}
                </th>
              </tr>
            </thead>
            <tbody>
              {transactionsWithBalance.map((tx) => (
                <tr key={tx.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {dateFormatter.format(tx.date)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {tx.type === BudgetLedgerTransactionType.Deposit
                      ? LEDGER_TRANSACTION_LIST_COPY.typeDeposit
                      : LEDGER_TRANSACTION_LIST_COPY.typeExpense}
                  </td>
                  <td className="px-4 py-3 text-sm">{tx.description}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">
                    {tx.type === BudgetLedgerTransactionType.Expense && "−"}
                    {currencyFormatter.format(tx.amount)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm">
                    {currencyFormatter.format(tx.runningBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
