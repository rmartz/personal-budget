"use client";

import Link from "next/link";

import { LedgerTransactionListView } from "@/components/ledger-transactions";
import { EditLedgerDialog } from "@/components/ledgers";
import { SavingsGoalListView } from "@/components/savings-goals";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BudgetLedgerTransaction } from "@/lib/firebase/schema/budget-ledger-transactions";
import { BudgetLedgerTransactionType } from "@/lib/firebase/schema/budget-ledger-transactions";
import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";
import type { Ledger, UpdateLedgerInput } from "@/lib/types";

import { LEDGER_DETAIL_COPY } from "./copy";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export interface LedgerDetailViewProps {
  ledger: Ledger | undefined;
  transactions: BudgetLedgerTransaction[];
  savingsGoals: BudgetLedgerSavingsGoal[];
  isLoading: boolean;
  onSaveLedger: (id: string, data: UpdateLedgerInput) => Promise<void>;
  onAddExpense: () => void;
  onAddDeposit: () => void;
  onAddGoal: () => void;
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (tx: BudgetLedgerTransaction) => void;
  onDeleteGoal: (id: string) => void;
  onEditGoal: (
    id: string,
    data: { name: string; targetAmount: number },
  ) => Promise<void>;
  onReorderGoal: (goalId: string, swapWithId: string) => Promise<void>;
}

export function LedgerDetailView({
  ledger,
  transactions,
  savingsGoals,
  isLoading,
  onSaveLedger,
  onAddExpense,
  onAddDeposit,
  onAddGoal,
  onDeleteTransaction,
  onEditTransaction,
  onDeleteGoal,
  onEditGoal,
  onReorderGoal,
}: LedgerDetailViewProps) {
  const cashBalance = ledger?.cashBalance ?? 0;
  const investmentBalance = ledger?.investmentBalance ?? 0;
  const totalBalance = cashBalance + investmentBalance;
  const cashPercent =
    totalBalance > 0 ? Math.round((cashBalance / totalBalance) * 100) : 0;
  const investedPercent = totalBalance > 0 ? 100 - cashPercent : 0;

  const now = new Date();
  const thisMonthTx = transactions.filter(
    (tx) =>
      tx.date.getFullYear() === now.getFullYear() &&
      tx.date.getMonth() === now.getMonth(),
  );
  const monthlyDeposits = thisMonthTx
    .filter((tx) => tx.type === BudgetLedgerTransactionType.Deposit)
    .reduce((sum, tx) => sum + tx.amount, 0);
  const monthlyExpenses = thisMonthTx
    .filter((tx) => tx.type === BudgetLedgerTransactionType.Expense)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const capPart =
    ledger?.cashCap !== undefined
      ? `Cash cap ${currencyFormatter.format(ledger.cashCap)}`
      : LEDGER_DETAIL_COPY.headerNoCashCap;
  const goalsCount = savingsGoals.length;
  const summaryLine = LEDGER_DETAIL_COPY.headerSummary(capPart, goalsCount);

  return (
    <div className="flex flex-col gap-6 px-4 py-8">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="text-sm text-muted-foreground">
        <Link href="/ledgers" className="hover:underline">
          {LEDGER_DETAIL_COPY.breadcrumbParent}
        </Link>
        {" / "}
        <span>{ledger?.name ?? ""}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {ledger?.name ?? ""}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{summaryLine}</p>
        </div>
        <div className="flex items-center gap-2">
          {ledger !== undefined && (
            <EditLedgerDialog
              ledgerId={ledger.id}
              initialName={ledger.name}
              initialCashCap={ledger.cashCap}
              onSave={onSaveLedger}
            />
          )}
          <Button variant="outline" onClick={onAddExpense}>
            {LEDGER_DETAIL_COPY.addExpenseButton}
          </Button>
          <Button onClick={onAddDeposit}>
            {LEDGER_DETAIL_COPY.addDepositButton}
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {LEDGER_DETAIL_COPY.totalSectionTitle}
          </p>
          <p className="mt-2 font-mono text-3xl font-semibold">
            {currencyFormatter.format(totalBalance)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {LEDGER_DETAIL_COPY.totalSubLabel(
              currencyFormatter.format(cashBalance),
              currencyFormatter.format(investmentBalance),
            )}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {LEDGER_DETAIL_COPY.splitSectionTitle}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {LEDGER_DETAIL_COPY.splitCashLabel}
              </p>
              <p className="font-mono text-lg font-semibold">{cashPercent}%</p>
              <p className="font-mono text-sm text-muted-foreground">
                {currencyFormatter.format(cashBalance)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {LEDGER_DETAIL_COPY.splitInvestmentLabel}
              </p>
              <p className="font-mono text-lg font-semibold">
                {investedPercent}%
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                {currencyFormatter.format(investmentBalance)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {LEDGER_DETAIL_COPY.monthSectionTitle}
          </p>
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span>{LEDGER_DETAIL_COPY.monthDepositsLabel}</span>
              <span className="font-mono">
                {currencyFormatter.format(monthlyDeposits)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{LEDGER_DETAIL_COPY.monthExpensesLabel}</span>
              <span className="font-mono">
                {currencyFormatter.format(monthlyExpenses)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 text-sm font-medium">
              <span>{LEDGER_DETAIL_COPY.monthNetLabel}</span>
              <span className="font-mono">
                {currencyFormatter.format(monthlyDeposits - monthlyExpenses)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_360px]">
        <LedgerTransactionListView
          ledgerName={ledger?.name ?? ""}
          transactions={transactions}
          isLoading={isLoading}
          onAddExpense={onAddExpense}
          onAddDeposit={onAddDeposit}
          onDeleteTransaction={onDeleteTransaction}
          onEditTransaction={onEditTransaction}
        />

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">
              {LEDGER_DETAIL_COPY.goalsSectionTitle}
            </h2>
            <Button variant="outline" size="sm" onClick={onAddGoal}>
              {LEDGER_DETAIL_COPY.addGoalButton}
            </Button>
          </div>
          <SavingsGoalListView
            goals={savingsGoals}
            onDelete={onDeleteGoal}
            onEdit={onEditGoal}
            onReorder={onReorderGoal}
          />
        </div>
      </div>
    </div>
  );
}
