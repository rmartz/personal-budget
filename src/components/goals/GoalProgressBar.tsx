"use client";

import { Bar } from "@/components/ui/bar";
import { currencyFormatter } from "@/lib/formatters";

import { GOAL_CARD_COPY, GOALS_LIST_COPY } from "./copy";

export interface GoalProgressBarProps {
  fundedAmount: number;
  targetAmount: number;
}

export function GoalProgressBar({
  fundedAmount,
  targetAmount,
}: GoalProgressBarProps) {
  const isFullyFunded = targetAmount > 0 && fundedAmount >= targetAmount;
  const progressPercent = isFullyFunded
    ? 100
    : targetAmount > 0
      ? Math.min(99, Math.floor((fundedAmount / targetAmount) * 100))
      : 0;
  const amountToGo = Math.max(0, targetAmount - fundedAmount);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tabular-nums">
          {currencyFormatter.format(fundedAmount)}
        </span>
        <span className="text-sm text-muted-foreground">
          {GOAL_CARD_COPY.ofTarget(currencyFormatter.format(targetAmount))}
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
    </div>
  );
}
