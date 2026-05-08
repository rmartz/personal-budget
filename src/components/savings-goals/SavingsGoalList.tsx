"use client";

import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";
import { Card } from "@/components/ui/card";
import { Bar } from "@/components/ui/bar";
import { SAVINGS_GOAL_LIST_COPY } from "./copy";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export interface SavingsGoalListViewProps {
  goals: BudgetLedgerSavingsGoal[];
}

export function SavingsGoalListView({ goals }: SavingsGoalListViewProps) {
  const sorted = [...goals].sort((a, b) => a.priority - b.priority);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold tracking-tight">
        {SAVINGS_GOAL_LIST_COPY.title}
      </h2>
      {sorted.length === 0 ? (
        <p className="py-8 text-center text-zinc-500 dark:text-zinc-400">
          {SAVINGS_GOAL_LIST_COPY.emptyStateMessage}
        </p>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 text-center">
                  {SAVINGS_GOAL_LIST_COPY.columnPriority}
                </th>
                <th className="px-4 py-3">
                  {SAVINGS_GOAL_LIST_COPY.columnName}
                </th>
                <th className="px-4 py-3 text-right">
                  {SAVINGS_GOAL_LIST_COPY.columnTarget}
                </th>
                <th className="px-4 py-3 text-right">
                  {SAVINGS_GOAL_LIST_COPY.columnFunded}
                </th>
                <th className="px-4 py-3">
                  {SAVINGS_GOAL_LIST_COPY.columnProgress}
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((goal) => {
                const progressPercent =
                  goal.targetAmount > 0
                    ? Math.round((goal.fundedAmount / goal.targetAmount) * 100)
                    : 0;

                return (
                  <tr key={goal.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3 text-center font-mono text-sm text-muted-foreground">
                      {goal.priority}
                    </td>
                    <td className="px-4 py-3 font-medium">{goal.name}</td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      {currencyFormatter.format(goal.targetAmount)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      {currencyFormatter.format(goal.fundedAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Bar value={progressPercent} className="max-w-24" />
                        <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                          {progressPercent}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
