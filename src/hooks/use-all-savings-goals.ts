"use client";

import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

import { getClientApp } from "@/lib/firebase/client";
import {
  type BudgetLedgerSavingsGoal,
  type FirebaseBudgetLedgerSavingsGoal,
  firebaseToBudgetLedgerSavingsGoal,
} from "@/lib/firebase/schema/savings-goals";

export function useAllSavingsGoals(uid: string) {
  const [goals, setGoals] = useState<BudgetLedgerSavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!uid) {
      setGoals([]);
      setIsLoading(false);
      setError(undefined);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    const db = getDatabase(getClientApp());
    const allGoalsRef = ref(db, `users/${uid}/budgetLedgerSavingsGoals`);

    const unsubscribe = onValue(
      allGoalsRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setGoals([]);
        } else {
          const data = snapshot.val() as Record<
            string,
            Record<string, FirebaseBudgetLedgerSavingsGoal>
          >;
          const flattened: BudgetLedgerSavingsGoal[] = Object.entries(
            data,
          ).flatMap(([ledgerId, ledgerGoals]) =>
            Object.entries(ledgerGoals).map(([id, entry]) =>
              firebaseToBudgetLedgerSavingsGoal(id, ledgerId, entry),
            ),
          );
          setGoals(flattened);
        }
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [uid]);

  return { goals, isLoading, error };
}
