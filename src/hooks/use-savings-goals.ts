"use client";

import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

import { getClientApp } from "@/lib/firebase/client";
import {
  type BudgetLedgerSavingsGoal,
  type FirebaseBudgetLedgerSavingsGoal,
  firebaseToBudgetLedgerSavingsGoal,
} from "@/lib/firebase/schema/savings-goals";

export function useSavingsGoals(uid: string, ledgerId: string) {
  const [savingsGoals, setSavingsGoals] = useState<BudgetLedgerSavingsGoal[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!uid || !ledgerId) {
      setSavingsGoals([]);
      setIsLoading(false);
      return;
    }

    const db = getDatabase(getClientApp());
    const goalsRef = ref(
      db,
      `users/${uid}/budgetLedgerSavingsGoals/${ledgerId}`,
    );

    const unsubscribe = onValue(
      goalsRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setSavingsGoals([]);
        } else {
          const data = snapshot.val() as Record<
            string,
            FirebaseBudgetLedgerSavingsGoal
          >;
          setSavingsGoals(
            Object.entries(data).map(([id, entry]) =>
              firebaseToBudgetLedgerSavingsGoal(id, ledgerId, entry),
            ),
          );
        }
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [uid, ledgerId]);

  return { savingsGoals, isLoading, error };
}
