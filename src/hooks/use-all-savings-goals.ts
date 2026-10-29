"use client";

import { parseCollection } from "@/lib/firebase/schema/parse-collection";
import {
  type BudgetLedgerSavingsGoal,
  firebaseToBudgetLedgerSavingsGoal,
} from "@/lib/firebase/schema/savings-goals";

import { useRealtimeSubscription } from "./use-realtime-subscription";

const NO_GOALS: BudgetLedgerSavingsGoal[] = [];

export function useAllSavingsGoals(uid: string) {
  const { data, isLoading, error } = useRealtimeSubscription(
    uid ? `users/${uid}/budgetLedgerSavingsGoals` : undefined,
    (snapshot) =>
      snapshot.exists()
        ? Object.entries(
            snapshot.val() as Record<string, Record<string, unknown>>,
          ).flatMap(([ledgerId, ledgerGoals]) =>
            parseCollection(ledgerGoals, (id, entry) =>
              firebaseToBudgetLedgerSavingsGoal(id, ledgerId, entry),
            ),
          )
        : NO_GOALS,
  );

  return { goals: data ?? NO_GOALS, isLoading, error };
}
