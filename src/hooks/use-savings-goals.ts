"use client";

import { parseCollection } from "@/lib/firebase/schema/parse-collection";
import {
  type BudgetLedgerSavingsGoal,
  firebaseToBudgetLedgerSavingsGoal,
} from "@/lib/firebase/schema/savings-goals";

import { useRealtimeSubscription } from "./use-realtime-subscription";

const NO_GOALS: BudgetLedgerSavingsGoal[] = [];

export function useSavingsGoals(uid: string, ledgerId: string) {
  const { data, isLoading, error } = useRealtimeSubscription(
    uid && ledgerId
      ? `users/${uid}/budgetLedgerSavingsGoals/${ledgerId}`
      : undefined,
    (snapshot) =>
      snapshot.exists()
        ? parseCollection(
            snapshot.val() as Record<string, unknown>,
            (id, entry) =>
              firebaseToBudgetLedgerSavingsGoal(id, ledgerId, entry),
          )
        : NO_GOALS,
  );

  return { savingsGoals: data ?? NO_GOALS, isLoading, error };
}
