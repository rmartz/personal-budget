"use client";

import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

import { getClientApp } from "@/lib/firebase/client";
import {
  type BudgetLedgerTransaction,
  firebaseToBudgetLedgerTransaction,
} from "@/lib/firebase/schema/budget-ledger-transactions";
import { parseCollection } from "@/lib/firebase/schema/parse-collection";

export function useTransactions(uid: string, ledgerId: string) {
  const [transactions, setTransactions] = useState<BudgetLedgerTransaction[]>(
    [],
  );
  const [loadedForKey, setLoadedForKey] = useState("");
  const [error, setError] = useState<Error | undefined>(undefined);

  const key = uid && ledgerId ? `${uid}:${ledgerId}` : "";
  const isLoading = !!uid && !!ledgerId && loadedForKey !== key;

  useEffect(() => {
    if (!uid || !ledgerId) {
      setError(undefined);
      setTransactions([]);
      setLoadedForKey("");
      return;
    }

    setError(undefined);
    const db = getDatabase(getClientApp());
    const txRef = ref(db, `users/${uid}/budgetLedgerTransactions/${ledgerId}`);
    const currentKey = `${uid}:${ledgerId}`;

    const unsubscribe = onValue(
      txRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setTransactions([]);
        } else {
          const data = snapshot.val() as Record<string, unknown>;
          setTransactions(
            parseCollection(data, (id, entry) =>
              firebaseToBudgetLedgerTransaction(id, ledgerId, entry),
            ),
          );
        }
        setLoadedForKey(currentKey);
      },
      (err) => {
        setError(err);
        setLoadedForKey(currentKey);
      },
    );

    return unsubscribe;
  }, [uid, ledgerId]);

  return { transactions, isLoading, error };
}
