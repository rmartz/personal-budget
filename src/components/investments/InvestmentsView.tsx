"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  AllocationTarget,
  InvestmentAccount,
} from "@/lib/firebase/schema/investments";
import { Posture } from "@/lib/firebase/schema/investments";

import { AllocationDashboardView } from "./AllocationDashboardView";
import {
  AGGREGATE_BUY_SELL_COPY,
  INVESTMENTS_VIEW_COPY,
  LEDGER_INVESTMENT_TABLE_COPY,
  MONTHLY_DISTRIBUTION_COPY,
  RECOMMENDED_CARD_COPY,
} from "./copy";
import { INVESTMENTS_PLACEHOLDER_FIXTURE } from "./fixtures";
import { PostureCard } from "./PostureCard";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export interface InvestmentsViewProps {
  accounts: InvestmentAccount[];
  allocation: AllocationTarget[];
  posture: Posture;
  isLoading: boolean;
  onApplyRebalance: () => void;
}

export function InvestmentsView({
  accounts,
  allocation,
  posture,
  isLoading,
  onApplyRebalance,
}: InvestmentsViewProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="h-32 animate-pulse rounded bg-muted" />
          <div className="h-32 animate-pulse rounded bg-muted" />
          <div className="h-32 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-48 animate-pulse rounded bg-muted" />
          <div className="h-48 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-48 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {INVESTMENTS_VIEW_COPY.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {accounts.length === 0
              ? INVESTMENTS_VIEW_COPY.titleSummary(
                  INVESTMENTS_PLACEHOLDER_FIXTURE.emptyTotalInvested,
                  0,
                  INVESTMENTS_PLACEHOLDER_FIXTURE.emptyMargin,
                )
              : INVESTMENTS_VIEW_COPY.titleSummary(
                  INVESTMENTS_PLACEHOLDER_FIXTURE.investedTotal,
                  accounts.length,
                  INVESTMENTS_PLACEHOLDER_FIXTURE.marginAvailable,
                )}
          </p>
        </div>
        <Button onClick={onApplyRebalance}>
          {INVESTMENTS_VIEW_COPY.applyRebalanceButton}
        </Button>
      </div>

      {/* Top three cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Recommended this month */}
        <Card className="flex flex-col gap-2 p-4">
          <CardHeader className="p-0">
            <CardTitle className="text-sm font-semibold">
              {RECOMMENDED_CARD_COPY.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-3xl font-bold tabular-nums">
              {INVESTMENTS_PLACEHOLDER_FIXTURE.recommendedAmount}
            </p>
            <p className="text-xs text-muted-foreground">
              {RECOMMENDED_CARD_COPY.sublabel(
                INVESTMENTS_PLACEHOLDER_FIXTURE.recommendedSublabel,
              )}
            </p>
          </CardContent>
        </Card>

        {/* Posture */}
        <PostureCard posture={posture} />

        {/* Aggregate buy / sell */}
        <Card className="flex flex-col gap-3 p-4">
          <CardHeader className="p-0">
            <CardTitle className="text-sm font-semibold">
              {AGGREGATE_BUY_SELL_COPY.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 p-0 text-sm">
            <p className="text-muted-foreground">
              {AGGREGATE_BUY_SELL_COPY.acrossAllLedgers}
            </p>
            <p className="font-mono font-medium text-green-600 dark:text-green-400">
              {AGGREGATE_BUY_SELL_COPY.buysLabel(
                INVESTMENTS_PLACEHOLDER_FIXTURE.buysTotal,
              )}
            </p>
            <p className="font-mono font-medium text-red-600 dark:text-red-400">
              {AGGREGATE_BUY_SELL_COPY.sellsLabel(
                INVESTMENTS_PLACEHOLDER_FIXTURE.sellsTotal,
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Middle two-column section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Target allocation */}
        <AllocationDashboardView accounts={accounts} />

        {/* Monthly distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              {MONTHLY_DISTRIBUTION_COPY.title(
                INVESTMENTS_PLACEHOLDER_FIXTURE.buysTotal,
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {allocation.length === 0 ? (
              <p className="px-4 pb-4 text-sm text-muted-foreground">
                {MONTHLY_DISTRIBUTION_COPY.noDistributionCalculated}
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2 font-medium">
                      {MONTHLY_DISTRIBUTION_COPY.columnAccount}
                    </th>
                    <th className="px-4 py-2 font-medium">
                      {MONTHLY_DISTRIBUTION_COPY.columnAction}
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      {MONTHLY_DISTRIBUTION_COPY.columnAmount}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allocation.map((row) => (
                    <tr
                      key={row.accountId}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-4 py-2 font-medium">
                        {row.accountName}
                      </td>
                      <td className="px-4 py-2 capitalize text-muted-foreground">
                        {row.action}
                      </td>
                      <td className="px-4 py-2 text-right font-mono">
                        {currencyFormatter.format(row.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Per-ledger investment portion */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            {LEDGER_INVESTMENT_TABLE_COPY.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">
                  {LEDGER_INVESTMENT_TABLE_COPY.columnLedger}
                </th>
                <th className="px-4 py-2 text-right font-medium">
                  {LEDGER_INVESTMENT_TABLE_COPY.columnCash}
                </th>
                <th className="px-4 py-2 text-right font-medium">
                  {LEDGER_INVESTMENT_TABLE_COPY.columnInvested}
                </th>
                <th className="px-4 py-2 text-right font-medium">
                  {LEDGER_INVESTMENT_TABLE_COPY.columnNetBuySell}
                </th>
              </tr>
            </thead>
            <tbody>
              {INVESTMENTS_PLACEHOLDER_FIXTURE.ledgerRows.map((row) => (
                <tr key={row.ledgerName} className="border-b last:border-b-0">
                  <td className="px-4 py-2 font-medium">{row.ledgerName}</td>
                  <td className="px-4 py-2 text-right font-mono">
                    {row.cashBalance}
                  </td>
                  <td className="px-4 py-2 text-right font-mono">
                    {row.investedBalance}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-green-600 dark:text-green-400">
                    {row.netBuySell}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t px-4 py-2 text-right">
            <button
              type="button"
              className="text-xs text-primary hover:underline"
            >
              {LEDGER_INVESTMENT_TABLE_COPY.viewAllLink(
                INVESTMENTS_PLACEHOLDER_FIXTURE.totalLedgerCount,
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
