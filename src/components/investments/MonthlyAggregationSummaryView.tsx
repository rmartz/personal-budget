"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  LEDGER_INVESTMENT_TABLE_COPY,
  MONTHLY_AGGREGATION_SUMMARY_COPY,
} from "./copy";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export interface LedgerAggregationRow {
  cashBalance: number;
  investmentBalance: number;
  ledgerId: string;
  ledgerName: string;
  netBuySell: number;
}

export interface MonthlyAggregationSummaryViewProps {
  onViewAll?: () => void;
  rows: LedgerAggregationRow[];
  totalLedgerCount: number;
}

export function MonthlyAggregationSummaryView({
  onViewAll,
  rows,
  totalLedgerCount,
}: MonthlyAggregationSummaryViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          {LEDGER_INVESTMENT_TABLE_COPY.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {rows.length === 0 ? (
          <p className="px-4 pb-4 text-sm text-muted-foreground">
            {MONTHLY_AGGREGATION_SUMMARY_COPY.noLedgerData}
          </p>
        ) : (
          <>
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
                {rows.map((row) => (
                  <tr key={row.ledgerId} className="border-b last:border-b-0">
                    <td className="px-4 py-2 font-medium">{row.ledgerName}</td>
                    <td className="px-4 py-2 text-right font-mono">
                      {currencyFormatter.format(row.cashBalance)}
                    </td>
                    <td className="px-4 py-2 text-right font-mono">
                      {currencyFormatter.format(row.investmentBalance)}
                    </td>
                    <td
                      className={`px-4 py-2 text-right font-mono ${
                        row.netBuySell >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {currencyFormatter.format(row.netBuySell)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {onViewAll !== undefined && (
              <div className="border-t px-4 py-2 text-right">
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={onViewAll}
                >
                  {LEDGER_INVESTMENT_TABLE_COPY.viewAllLink(totalLedgerCount)}
                </button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
