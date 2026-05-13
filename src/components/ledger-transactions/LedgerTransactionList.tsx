"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogPopup,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  onAddExpense: () => void;
  onAddDeposit?: () => void;
  onDeleteTransaction: (id: string) => void;
  onEditTransaction?: (transaction: BudgetLedgerTransaction) => void;
}

export function LedgerTransactionListView({
  ledgerName,
  transactions,
  isLoading,
  onAddExpense,
  onAddDeposit,
  onDeleteTransaction,
  onEditTransaction,
}: LedgerTransactionListViewProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | undefined>(
    undefined,
  );

  const transactionsWithBalance = computeRunningBalances(transactions);

  function handleDeleteClick(id: string) {
    setPendingDeleteId(id);
  }

  function handleDeleteConfirm() {
    if (pendingDeleteId !== undefined) {
      onDeleteTransaction(pendingDeleteId);
    }
    setPendingDeleteId(undefined);
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open) {
      setPendingDeleteId(undefined);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {ledgerName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {LEDGER_TRANSACTION_LIST_COPY.title}
          </p>
        </div>
        <div className="flex gap-2">
          {onAddDeposit !== undefined && (
            <Button variant="outline" onClick={onAddDeposit}>
              {LEDGER_TRANSACTION_LIST_COPY.addDepositButton}
            </Button>
          )}
          <Button onClick={onAddExpense}>
            {LEDGER_TRANSACTION_LIST_COPY.addExpenseButton}
          </Button>
        </div>
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
                <th className="px-4 py-3">
                  <span className="sr-only">
                    {LEDGER_TRANSACTION_LIST_COPY.columnActions}
                  </span>
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
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onEditTransaction !== undefined && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`${LEDGER_TRANSACTION_LIST_COPY.editButtonLabel}: ${tx.description}`}
                          onClick={() => {
                            onEditTransaction(tx);
                          }}
                        >
                          <Pencil aria-hidden="true" className="size-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`${LEDGER_TRANSACTION_LIST_COPY.deleteButtonLabel}: ${tx.description}`}
                        onClick={() => {
                          handleDeleteClick(tx.id);
                        }}
                      >
                        <Trash2
                          aria-hidden="true"
                          className="size-4 text-destructive"
                        />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <AlertDialogRoot
        open={pendingDeleteId !== undefined}
        onOpenChange={handleDialogOpenChange}
      >
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup>
            <AlertDialogTitle>
              {LEDGER_TRANSACTION_LIST_COPY.deleteConfirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {LEDGER_TRANSACTION_LIST_COPY.deleteConfirmDescription}
            </AlertDialogDescription>
            <div className="mt-6 flex justify-end gap-3">
              <AlertDialogClose>
                {LEDGER_TRANSACTION_LIST_COPY.deleteCancelButton}
              </AlertDialogClose>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                {LEDGER_TRANSACTION_LIST_COPY.deleteConfirmButton}
              </Button>
            </div>
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialogRoot>
    </div>
  );
}
