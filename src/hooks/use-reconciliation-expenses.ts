"use client";

import { parseCollection } from "@/lib/firebase/schema/parse-collection";
import {
  firebaseToReconciliationExpense,
  type ReconciliationExpense,
} from "@/lib/firebase/schema/reconciliation-expenses";

import { useRealtimeSubscription } from "./use-realtime-subscription";

const NO_EXPENSES: ReconciliationExpense[] = [];

export function useReconciliationExpenses(uid: string) {
  const { data, isLoading, error } = useRealtimeSubscription(
    uid ? `users/${uid}/reconciliationExpenses` : undefined,
    (snapshot) =>
      snapshot.exists()
        ? parseCollection(
            snapshot.val() as Record<string, unknown>,
            firebaseToReconciliationExpense,
          )
        : NO_EXPENSES,
  );

  return { reconciliationExpenses: data ?? NO_EXPENSES, isLoading, error };
}
