"use client";

import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

import { getClientApp } from "@/lib/firebase/client";
import { parseCollection } from "@/lib/firebase/schema/parse-collection";
import {
  firebaseToReconciliationAccount,
  type ReconciliationAccount,
} from "@/lib/firebase/schema/reconciliation-accounts";

export function useReconciliationAccounts(uid: string) {
  const [reconciliationAccounts, setReconciliationAccounts] = useState<
    ReconciliationAccount[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!uid) {
      setReconciliationAccounts([]);
      setIsLoading(false);
      return;
    }

    const db = getDatabase(getClientApp());
    const accountsRef = ref(db, `users/${uid}/reconciliationAccounts`);

    const unsubscribe = onValue(
      accountsRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setReconciliationAccounts([]);
        } else {
          const data = snapshot.val() as Record<string, unknown>;
          setReconciliationAccounts(
            parseCollection(data, firebaseToReconciliationAccount),
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

  return { reconciliationAccounts, isLoading, error };
}
