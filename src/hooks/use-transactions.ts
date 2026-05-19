"use client";

import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

import { getClientApp } from "@/lib/firebase/client";
import {
  type BudgetLedgerTransaction,
  type FirebaseBudgetLedgerTransaction,
  firebaseToBudgetLedgerTransaction,
} from "@/lib/firebase/schema/budget-ledger-transactions";

export function useTransactions(uid: string, ledgerId: string) {
  const [transactions, setTransactions] = useState<BudgetLedgerTransaction[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!uid || !ledgerId) {
      setError(undefined);
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    setError(undefined);
    setIsLoading(true);
    const db = getDatabase(getClientApp());
    const txRef = ref(db, `users/${uid}/budgetLedgerTransactions/${ledgerId}`);

    const unsubscribe = onValue(
      txRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setTransactions([]);
        } else {
          const data = snapshot.val() as Record<
            string,
            FirebaseBudgetLedgerTransaction
          >;
          setTransactions(
            Object.entries(data).map(([id, entry]) =>
              firebaseToBudgetLedgerTransaction(id, ledgerId, entry),
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

  return { transactions, isLoading, error };
}
