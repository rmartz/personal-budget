"use client";

import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { getClientApp } from "@/lib/firebase/client";
import {
  firebaseToReconciliationExpense,
  type FirebaseReconciliationExpense,
  type ReconciliationExpense,
} from "@/lib/firebase/schema/reconciliation-expenses";

export function useReconciliationExpenses(uid: string) {
  const [reconciliationExpenses, setReconciliationExpenses] = useState<
    ReconciliationExpense[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!uid) {
      setReconciliationExpenses([]);
      setIsLoading(false);
      return;
    }

    const db = getDatabase(getClientApp());
    const expensesRef = ref(db, `users/${uid}/reconciliationExpenses`);

    const unsubscribe = onValue(
      expensesRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setReconciliationExpenses([]);
        } else {
          const data = snapshot.val() as Record<
            string,
            FirebaseReconciliationExpense
          >;
          setReconciliationExpenses(
            Object.entries(data).map(([id, entry]) =>
              firebaseToReconciliationExpense(id, entry),
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
  }, [uid]);

  return { reconciliationExpenses, isLoading, error };
}
