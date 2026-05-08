"use client";

import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";
import { Card } from "@/components/ui/card";
import { SavingsGoalListItem } from "./SavingsGoalListItem";
import { SAVINGS_GOAL_LIST_COPY } from "./copy";

export interface SavingsGoalListViewProps {
  goals: BudgetLedgerSavingsGoal[];
  onDelete: (id: string) => void;
  onEdit: (
    id: string,
    data: { name: string; targetAmount: number },
  ) => Promise<void>;
  onReorder: (goalId: string, swapWithId: string) => Promise<void>;
}

export function SavingsGoalListView({
  goals,
  onDelete,
  onEdit,
  onReorder,
}: SavingsGoalListViewProps) {
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
                <th className="px-4 py-3">
                  {SAVINGS_GOAL_LIST_COPY.columnActions}
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((goal, index) => {
                const isFirst = index === 0;
                const isLast = index === sorted.length - 1;
                const prevGoal = isFirst ? undefined : sorted[index - 1];
                const nextGoal = isLast ? undefined : sorted[index + 1];

                return (
                  <SavingsGoalListItem
                    key={goal.id}
                    goal={goal}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onReorder={onReorder}
                    isFirst={isFirst}
                    isLast={isLast}
                    prevGoalId={prevGoal?.id}
                    nextGoalId={nextGoal?.id}
                  />
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
