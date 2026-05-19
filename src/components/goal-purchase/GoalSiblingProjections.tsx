"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";
import { monthYearFormatter } from "@/lib/formatters";
import { computeGoalEta } from "@/lib/goal-funding";

import { GOAL_SIBLING_PROJECTIONS_COPY } from "./copy";

export interface GoalSiblingProjectionsProps {
  monthlyAllocation: number;
  purchasedGoal: BudgetLedgerSavingsGoal;
  siblingGoals: BudgetLedgerSavingsGoal[];
}

export function GoalSiblingProjections({
  monthlyAllocation,
  purchasedGoal,
  siblingGoals,
}: GoalSiblingProjectionsProps) {
  const allGoalsBeforePurchase = [...siblingGoals, purchasedGoal].filter(
    (g) => g.fundedAmount < g.targetAmount,
  );
  const unfundedSiblingGoals = siblingGoals.filter(
    (g) => g.fundedAmount < g.targetAmount,
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          {GOAL_SIBLING_PROJECTIONS_COPY.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {siblingGoals.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">
                  {GOAL_SIBLING_PROJECTIONS_COPY.columnGoal}
                </th>
                <th className="px-4 py-2 font-medium">
                  {GOAL_SIBLING_PROJECTIONS_COPY.columnPriorEta}
                </th>
                <th className="px-4 py-2 font-medium">
                  {GOAL_SIBLING_PROJECTIONS_COPY.columnNewEta}
                </th>
              </tr>
            </thead>
            <tbody>
              {siblingGoals.map((goal) => {
                const priorEta = computeGoalEta(
                  goal,
                  allGoalsBeforePurchase,
                  monthlyAllocation,
                );
                const newEta = computeGoalEta(
                  goal,
                  unfundedSiblingGoals,
                  monthlyAllocation,
                );
                return (
                  <tr key={goal.id} className="border-b last:border-b-0">
                    <td className="px-4 py-2 font-medium">{goal.name}</td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {priorEta !== undefined
                        ? monthYearFormatter.format(priorEta)
                        : GOAL_SIBLING_PROJECTIONS_COPY.etaPlaceholder}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {newEta !== undefined
                        ? monthYearFormatter.format(newEta)
                        : GOAL_SIBLING_PROJECTIONS_COPY.etaPlaceholder}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <p className="px-4 py-3 text-xs text-muted-foreground">
          {GOAL_SIBLING_PROJECTIONS_COPY.footer}
        </p>
      </CardContent>
    </Card>
  );
}
