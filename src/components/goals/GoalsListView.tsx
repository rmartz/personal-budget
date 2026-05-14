"use client";

import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { GoalCard } from "./GoalCard";
import { GOALS_LIST_COPY } from "./copy";

export interface GoalsListViewProps {
  goals: BudgetLedgerSavingsGoal[];
  ledgerNames: Record<string, string>;
  isLoading: boolean;
}

export function GoalsListView({
  goals,
  ledgerNames,
  isLoading,
}: GoalsListViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          {GOALS_LIST_COPY.title}
        </h1>
        <div className="flex gap-2">
          <span className="text-sm text-muted-foreground">
            {GOALS_LIST_COPY.sortByPriority}
          </span>
          <span className="text-sm text-muted-foreground">
            {GOALS_LIST_COPY.sortByLedger}
          </span>
          <span className="text-sm text-muted-foreground">
            {GOALS_LIST_COPY.sortByEta}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="h-40 p-4">
            <Skeleton className="h-full w-full" />
          </Card>
          <Card className="h-40 p-4">
            <Skeleton className="h-full w-full" />
          </Card>
        </div>
      ) : goals.length === 0 ? (
        <p className="py-12 text-center text-zinc-500 dark:text-zinc-400">
          {GOALS_LIST_COPY.emptyStateMessage}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              ledgerName={ledgerNames[goal.ledgerId] ?? goal.ledgerId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
