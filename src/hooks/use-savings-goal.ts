"use client";

import {
  type BudgetLedgerSavingsGoal,
  firebaseToBudgetLedgerSavingsGoal,
} from "@/lib/firebase/schema/savings-goals";

import { useRealtimeSubscription } from "./use-realtime-subscription";

type GoalsByLedger = Record<string, Record<string, unknown>>;

interface UseSavingsGoalResult {
  goal: BudgetLedgerSavingsGoal | undefined;
  isLoading: boolean;
  error: Error | undefined;
}

function findGoal(
  goalsByLedger: GoalsByLedger,
  goalId: string,
): BudgetLedgerSavingsGoal | undefined {
  for (const [ledgerId, ledgerGoals] of Object.entries(goalsByLedger)) {
    const entry = ledgerGoals[goalId];
    if (entry !== undefined) {
      return firebaseToBudgetLedgerSavingsGoal(goalId, ledgerId, entry);
    }
  }
  return undefined;
}

export function useSavingsGoal(
  uid: string,
  goalId: string,
): UseSavingsGoalResult {
  // The goal's ledger isn't known up front, so subscribe to every ledger's
  // goals and pick this one out during render.
  const { data, isLoading, error } = useRealtimeSubscription(
    uid && goalId ? `users/${uid}/budgetLedgerSavingsGoals` : undefined,
    (snapshot): GoalsByLedger =>
      snapshot.exists() ? (snapshot.val() as GoalsByLedger) : {},
  );

  return {
    goal: data && goalId ? findGoal(data, goalId) : undefined,
    isLoading,
    error,
  };
}
