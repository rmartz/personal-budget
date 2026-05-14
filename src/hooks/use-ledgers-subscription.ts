"use client";

import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

import { getClientApp } from "@/lib/firebase/client";
import {
  type BudgetLedger,
  type FirebaseBudgetLedger,
  firebaseToBudgetLedger,
} from "@/lib/firebase/schema/budget-ledgers";

export function useLedgersSubscription(uid: string) {
  const [ledgers, setLedgers] = useState<BudgetLedger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!uid) {
      setLedgers([]);
      setIsLoading(false);
      return;
    }

    const db = getDatabase(getClientApp());
    const ledgersRef = ref(db, `users/${uid}/budgetLedgers`);

    const unsubscribe = onValue(
      ledgersRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setLedgers([]);
        } else {
          const data = snapshot.val() as Record<string, FirebaseBudgetLedger>;
          setLedgers(
            Object.entries(data).map(([id, entry]) =>
              firebaseToBudgetLedger(id, entry),
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

  return { ledgers, isLoading, error };
}
