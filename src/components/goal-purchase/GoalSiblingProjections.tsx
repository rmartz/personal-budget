"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";
import { monthYearFormatter } from "@/lib/formatters";
import { computeGoalEtaFromShare, computeZipfShares } from "@/lib/goal-funding";

import { GOAL_SIBLING_PROJECTIONS_COPY } from "./copy";

export interface GoalSiblingProjectionsProps {
  monthlyAllocation: number;
  purchasedGoal: BudgetLedgerSavingsGoal;
  referenceDate: Date;
  siblingGoals: BudgetLedgerSavingsGoal[];
}

export function GoalSiblingProjections({
  monthlyAllocation,
  purchasedGoal,
  referenceDate,
  siblingGoals,
}: GoalSiblingProjectionsProps) {
  const allGoalsBeforePurchase = [
    ...siblingGoals.filter((g) => g.fundedAmount < g.targetAmount),
    purchasedGoal,
  ];
  const unfundedSiblingGoals = siblingGoals.filter(
    (g) => g.fundedAmount < g.targetAmount,
  );
  const priorShares = computeZipfShares(allGoalsBeforePurchase);
  const newShares = computeZipfShares(unfundedSiblingGoals);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          {GOAL_SIBLING_PROJECTIONS_COPY.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {unfundedSiblingGoals.length > 0 && (
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
              {unfundedSiblingGoals.map((goal) => {
                const priorEta = computeGoalEtaFromShare(
                  goal,
                  priorShares.get(goal.id) ?? 0,
                  monthlyAllocation,
                  referenceDate,
                );
                const newEta = computeGoalEtaFromShare(
                  goal,
                  newShares.get(goal.id) ?? 0,
                  monthlyAllocation,
                  referenceDate,
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
