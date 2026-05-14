"use client";

import Link from "next/link";

import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

import { GOAL_PURCHASE_VIEW_COPY } from "./copy";
import { GoalPurchaseForm } from "./GoalPurchaseForm";
import { GoalPurchaseWarning } from "./GoalPurchaseWarning";
import { GoalSiblingProjections } from "./GoalSiblingProjections";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export interface GoalPurchaseViewProps {
  goal: BudgetLedgerSavingsGoal;
  ledgerName: string;
  siblingGoals: BudgetLedgerSavingsGoal[];
  onSubmit: () => void;
}

export function GoalPurchaseView({
  goal,
  ledgerName,
  siblingGoals,
  onSubmit,
}: GoalPurchaseViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/goals"
          className="mb-1 text-sm text-muted-foreground hover:underline"
        >
          {GOAL_PURCHASE_VIEW_COPY.breadcrumbParent}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          {GOAL_PURCHASE_VIEW_COPY.headerPrefix} · {goal.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {GOAL_PURCHASE_VIEW_COPY.headerSummary(
            ledgerName,
            currencyFormatter.format(goal.targetAmount),
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GoalPurchaseForm
          ledgerName={ledgerName}
          targetAmount={goal.targetAmount}
          onSubmit={onSubmit}
        />

        <div className="flex flex-col gap-4">
          <GoalPurchaseWarning />
          <GoalSiblingProjections siblingGoals={siblingGoals} />
        </div>
      </div>
    </div>
  );
}
