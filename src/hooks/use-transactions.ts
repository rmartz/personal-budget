"use client";

import {
  type BudgetLedgerTransaction,
  firebaseToBudgetLedgerTransaction,
} from "@/lib/firebase/schema/budget-ledger-transactions";
import { parseCollection } from "@/lib/firebase/schema/parse-collection";

import { useRealtimeSubscription } from "./use-realtime-subscription";

const NO_TRANSACTIONS: BudgetLedgerTransaction[] = [];

export function useTransactions(uid: string, ledgerId: string) {
  const { data, isLoading, error } = useRealtimeSubscription(
    uid && ledgerId
      ? `users/${uid}/budgetLedgerTransactions/${ledgerId}`
      : undefined,
    (snapshot) =>
      snapshot.exists()
        ? parseCollection(
            snapshot.val() as Record<string, unknown>,
            (id, entry) =>
              firebaseToBudgetLedgerTransaction(id, ledgerId, entry),
          )
        : NO_TRANSACTIONS,
  );

  return { transactions: data ?? NO_TRANSACTIONS, isLoading, error };
}
