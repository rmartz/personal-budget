"use client";

import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GOAL_SIBLING_PROJECTIONS_COPY } from "./copy";

export interface GoalSiblingProjectionsProps {
  siblingGoals: BudgetLedgerSavingsGoal[];
}

export function GoalSiblingProjections({
  siblingGoals,
}: GoalSiblingProjectionsProps) {
  // TODO: Implement real ETA recalculation in epic #14 (Goal Purchase Flow)
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
                <th className="px-4 py-2 font-medium">Goal</th>
                <th className="px-4 py-2 font-medium">
                  {GOAL_SIBLING_PROJECTIONS_COPY.columnPriorEta}
                </th>
                <th className="px-4 py-2 font-medium">
                  {GOAL_SIBLING_PROJECTIONS_COPY.columnNewEta}
                </th>
              </tr>
            </thead>
            <tbody>
              {siblingGoals.map((goal) => (
                <tr key={goal.id} className="border-b last:border-b-0">
                  <td className="px-4 py-2 font-medium">{goal.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {GOAL_SIBLING_PROJECTIONS_COPY.etaPlaceholder}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {GOAL_SIBLING_PROJECTIONS_COPY.etaPlaceholder}
                  </td>
                </tr>
              ))}
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
