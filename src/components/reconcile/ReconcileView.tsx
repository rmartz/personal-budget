"use client";

import { Button } from "@/components/ui/button";
import type { ReconciliationAccount } from "@/lib/firebase/schema/reconciliation-accounts";
import type { ReconciliationExpense } from "@/lib/firebase/schema/reconciliation-expenses";

import { ReconcileBalanceInputsView } from "./ReconcileBalanceInputsView";
import { RECONCILE_VIEW_COPY } from "./ReconcileView.copy";

// TODO: Replace placeholder data with useReconciliation(uid, month) — see epic #18 (Monthly Reconciliation)

const PLACEHOLDER_MONTH = "May 2026";

const PLACEHOLDER_CASH_FLOW_ACCOUNTS = [
  { account: "Checking", balance: "$4,200" },
  { account: "High-yield savings", balance: "$18,500" },
  { account: "Brokerage", balance: "$62,000" },
];

const PLACEHOLDER_CASH_FLOW_ACTIONS = [
  { action: "Move to investments", amount: "$1,200" },
  { action: "Keep as cash reserve", amount: "$3,000" },
  { action: "Assign to ledgers", amount: "$400" },
];

const PLACEHOLDER_TILES = [
  { label: RECONCILE_VIEW_COPY.tileCashSurplus, value: "$4,200" },
  { label: RECONCILE_VIEW_COPY.tileToInvest, value: "$1,200" },
  { label: RECONCILE_VIEW_COPY.tileInterTierTransfer, value: "$0" },
  { label: RECONCILE_VIEW_COPY.tileAssignToLedgers, value: "$400" },
];

const PLACEHOLDER_INVESTMENT_ROWS = [
  { label: "Posture", value: "Moderate growth" },
  { label: "Cash above floors", value: "$1,200" },
  { label: "Margin available", value: "$500" },
  { label: "Target allocation", value: "70 / 30" },
];

export interface ReconcileViewProps {
  accountBalances?: Record<string, number | undefined>;
  accounts?: ReconciliationAccount[];
  expenseAmounts?: Record<string, number | undefined>;
  expenses?: ReconciliationExpense[];
  onAccountBalanceChange?: (
    accountId: string,
    balance: number | undefined,
  ) => void;
  onExpenseAmountChange?: (
    expenseId: string,
    amount: number | undefined,
  ) => void;
  onNewExpense?: () => void;
}

export function ReconcileView({
  accountBalances = {},
  accounts = [],
  expenseAmounts = {},
  expenses = [],
  onAccountBalanceChange = () => undefined,
  onExpenseAmountChange = () => undefined,
  onNewExpense,
}: ReconcileViewProps) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {RECONCILE_VIEW_COPY.pageHeading}
          </h1>
          <p className="text-sm text-muted-foreground">
            {RECONCILE_VIEW_COPY.tagline}
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          {onNewExpense !== undefined && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onNewExpense}
            >
              {RECONCILE_VIEW_COPY.actionNewExpense}
            </Button>
          )}
          <Button type="button" variant="outline" size="sm">
            {RECONCILE_VIEW_COPY.actionConfirmed}
          </Button>
          <Button type="button" variant="outline" size="sm">
            {RECONCILE_VIEW_COPY.actionProjected}
          </Button>
          <Button type="button" size="sm">
            {RECONCILE_VIEW_COPY.actionApply}
          </Button>
        </div>
      </div>

      {/* Cash flow block */}
      <section className="mb-8 rounded-xl border p-6">
        <h2 className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          {RECONCILE_VIEW_COPY.cashFlowSectionLabel} · {PLACEHOLDER_MONTH}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {RECONCILE_VIEW_COPY.cashFlowAccountBalancesLabel}
            </p>
            <ul className="space-y-2">
              {PLACEHOLDER_CASH_FLOW_ACCOUNTS.map((row) => (
                <li key={row.account} className="flex justify-between text-sm">
                  <span>{row.account}</span>
                  <span className="font-medium">{row.balance}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {RECONCILE_VIEW_COPY.cashFlowRecommendedActionsLabel}
            </p>
            <ul className="space-y-2">
              {PLACEHOLDER_CASH_FLOW_ACTIONS.map((row) => (
                <li key={row.action} className="flex justify-between text-sm">
                  <span>{row.action}</span>
                  <span className="font-medium">{row.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Summary tiles */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {PLACEHOLDER_TILES.map((tile) => (
          <div
            key={tile.label}
            className="rounded-xl border bg-muted/30 p-4 text-center"
          >
            <p className="text-xs text-muted-foreground">{tile.label}</p>
            <p className="mt-1 text-2xl font-bold">{tile.value}</p>
          </div>
        ))}
      </div>

      {/* Inputs needed + investment explanation */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Inputs needed */}
        <section className="rounded-xl border p-6">
          <h2 className="mb-4 text-sm font-semibold">
            {RECONCILE_VIEW_COPY.inputsNeededHeading}
          </h2>
          <ReconcileBalanceInputsView
            accountBalances={accountBalances}
            accounts={accounts}
            expenseAmounts={expenseAmounts}
            expenses={expenses}
            onAccountBalanceChange={onAccountBalanceChange}
            onExpenseAmountChange={onExpenseAmountChange}
          />
        </section>

        {/* Why this investment amount? */}
        <section className="rounded-xl border p-6">
          <h2 className="mb-4 text-sm font-semibold">
            {RECONCILE_VIEW_COPY.investmentExplanationHeading}
          </h2>
          <ul className="space-y-3">
            {PLACEHOLDER_INVESTMENT_ROWS.map((row) => (
              <li key={row.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium">{row.value}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
