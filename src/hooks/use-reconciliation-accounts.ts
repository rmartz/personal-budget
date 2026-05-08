"use client";

import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { getClientApp } from "@/lib/firebase/client";
import {
  firebaseToReconciliationAccount,
  type FirebaseReconciliationAccount,
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
          const data = snapshot.val() as Record<
            string,
            FirebaseReconciliationAccount
          >;
          setReconciliationAccounts(
            Object.entries(data).map(([id, entry]) =>
              firebaseToReconciliationAccount(id, entry),
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

  return { reconciliationAccounts, isLoading, error };
}
