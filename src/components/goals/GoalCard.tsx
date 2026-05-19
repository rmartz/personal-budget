"use client";

import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

import { GOAL_CARD_COPY, GOALS_LIST_COPY } from "./copy";
import { GoalProgressBar } from "./GoalProgressBar";

export interface GoalCardProps {
  goal: BudgetLedgerSavingsGoal;
  ledgerName: string;
}

export function GoalCard({ goal, ledgerName }: GoalCardProps) {
  const isFullyFunded =
    goal.targetAmount > 0 && goal.fundedAmount >= goal.targetAmount;

  return (
    <Link href={`/goals/${goal.id}/purchase`} className="block">
      <Card className="flex h-full flex-col gap-3 p-4 transition-colors hover:bg-muted/50">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-semibold tracking-widest text-muted-foreground">
            {ledgerName.toUpperCase()} {GOAL_CARD_COPY.eyebrowSeparator}{" "}
            {GOAL_CARD_COPY.priorityLabel(goal.priority)}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {isFullyFunded
              ? GOALS_LIST_COPY.etaFunded
              : GOALS_LIST_COPY.etaPlaceholder}
          </span>
        </div>

        <p className="text-base font-semibold leading-snug">{goal.name}</p>

        <GoalProgressBar
          fundedAmount={goal.fundedAmount}
          targetAmount={goal.targetAmount}
        />
      </Card>
    </Link>
  );
}
