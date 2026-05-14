"use client";

import Link from "next/link";

import { Bar } from "@/components/ui/bar";
import { Card } from "@/components/ui/card";
import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

import { GOAL_CARD_COPY, GOALS_LIST_COPY } from "./copy";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export interface GoalCardProps {
  goal: BudgetLedgerSavingsGoal;
  ledgerName: string;
}

export function GoalCard({ goal, ledgerName }: GoalCardProps) {
  const isFullyFunded = goal.fundedAmount >= goal.targetAmount;
  const progressPercent = isFullyFunded
    ? 100
    : goal.targetAmount > 0
      ? Math.min(99, Math.floor((goal.fundedAmount / goal.targetAmount) * 100))
      : 0;
  const amountToGo = Math.max(0, goal.targetAmount - goal.fundedAmount);

  return (
    <Link href={`/goals/${goal.id}/purchase`} className="block">
      <Card className="flex h-full flex-col gap-3 p-4 transition-colors hover:bg-muted/50">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-semibold tracking-widest text-muted-foreground">
            {ledgerName.toUpperCase()} {GOAL_CARD_COPY.eyebrowSeparator} P
            {String(goal.priority)}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {isFullyFunded
              ? GOALS_LIST_COPY.etaFunded
              : GOALS_LIST_COPY.etaPlaceholder}
          </span>
        </div>

        <p className="text-base font-semibold leading-snug">{goal.name}</p>

        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tabular-nums">
            {currencyFormatter.format(goal.fundedAmount)}
          </span>
          <span className="text-sm text-muted-foreground">
            {GOAL_CARD_COPY.ofTarget(
              currencyFormatter.format(goal.targetAmount),
            )}
          </span>
        </div>

        <Bar value={progressPercent} className="w-full" />

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {GOAL_CARD_COPY.fundedLabel(progressPercent)}
          </span>
          <span
            className={
              isFullyFunded
                ? "font-medium text-green-600 dark:text-green-400"
                : "text-muted-foreground"
            }
          >
            {isFullyFunded
              ? GOALS_LIST_COPY.readyToPurchase
              : GOAL_CARD_COPY.toGoLabel(currencyFormatter.format(amountToGo))}
          </span>
        </div>
      </Card>
    </Link>
  );
}
