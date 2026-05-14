"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

import { GOALS_LIST_COPY } from "./copy";
import { GoalCard } from "./GoalCard";

export interface GoalsListViewProps {
  goals: BudgetLedgerSavingsGoal[];
  ledgerNames: Record<string, string>;
  isLoading: boolean;
  error?: Error;
}

export function GoalsListView({
  goals,
  ledgerNames,
  isLoading,
  error,
}: GoalsListViewProps) {
  const fullyFunded = goals.filter(
    (g) => g.fundedAmount >= g.targetAmount,
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {GOALS_LIST_COPY.title}
          </h1>
          {!isLoading && error === undefined && (
            <p className="text-sm text-muted-foreground">
              {GOALS_LIST_COPY.goalCount(goals.length)}
              {" · "}
              {GOALS_LIST_COPY.fullyFundedCount(fullyFunded)}
              {" · "}
              {GOALS_LIST_COPY.zipfProgress}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            className="text-sm text-muted-foreground"
          >
            {GOALS_LIST_COPY.sortByPriority}
          </button>
          <button
            type="button"
            disabled
            className="text-sm text-muted-foreground"
          >
            {GOALS_LIST_COPY.sortByLedger}
          </button>
          <button
            type="button"
            disabled
            className="text-sm text-muted-foreground"
          >
            {GOALS_LIST_COPY.sortByEta}
          </button>
          <button
            type="button"
            disabled
            className="text-sm font-medium text-primary"
          >
            {GOALS_LIST_COPY.newGoalButton}
          </button>
        </div>
      </div>

      {error !== undefined ? (
        <p className="py-12 text-center text-destructive">
          {GOALS_LIST_COPY.errorMessage}
        </p>
      ) : isLoading ? (
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
