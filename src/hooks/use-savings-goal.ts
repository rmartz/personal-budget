"use client";

import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

import { getClientApp } from "@/lib/firebase/client";
import {
  type BudgetLedgerSavingsGoal,
  type FirebaseBudgetLedgerSavingsGoal,
  firebaseToBudgetLedgerSavingsGoal,
} from "@/lib/firebase/schema/savings-goals";

interface UseSavingsGoalResult {
  goal: BudgetLedgerSavingsGoal | undefined;
  isLoading: boolean;
  error: Error | undefined;
}

export function useSavingsGoal(
  uid: string,
  goalId: string,
): UseSavingsGoalResult {
  const [goal, setGoal] = useState<BudgetLedgerSavingsGoal | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!uid || !goalId) {
      setGoal(undefined);
      setIsLoading(false);
      return;
    }

    const db = getDatabase(getClientApp());
    const allGoalsRef = ref(db, `users/${uid}/budgetLedgerSavingsGoals`);

    const unsubscribe = onValue(
      allGoalsRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setGoal(undefined);
        } else {
          const data = snapshot.val() as Record<
            string,
            Record<string, FirebaseBudgetLedgerSavingsGoal>
          >;
          let found: BudgetLedgerSavingsGoal | undefined;
          for (const [ledgerId, ledgerGoals] of Object.entries(data)) {
            const entry = ledgerGoals[goalId];
            if (entry !== undefined) {
              found = firebaseToBudgetLedgerSavingsGoal(
                goalId,
                ledgerId,
                entry,
              );
              break;
            }
          }
          setGoal(found);
        }
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [uid, goalId]);

  return { goal, isLoading, error };
}
