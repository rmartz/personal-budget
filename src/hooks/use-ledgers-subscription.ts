"use client";

import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

import { getClientApp } from "@/lib/firebase/client";
import {
  type BudgetLedger,
  firebaseToBudgetLedger,
} from "@/lib/firebase/schema/budget-ledgers";
import { parseCollection } from "@/lib/firebase/schema/parse-collection";

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
          const data = snapshot.val() as Record<string, unknown>;
          setLedgers(parseCollection(data, firebaseToBudgetLedger));
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
