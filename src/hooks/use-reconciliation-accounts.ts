"use client";

import { parseCollection } from "@/lib/firebase/schema/parse-collection";
import {
  firebaseToReconciliationAccount,
  type ReconciliationAccount,
} from "@/lib/firebase/schema/reconciliation-accounts";

import { useRealtimeSubscription } from "./use-realtime-subscription";

const NO_ACCOUNTS: ReconciliationAccount[] = [];

export function useReconciliationAccounts(uid: string) {
  const { data, isLoading, error } = useRealtimeSubscription(
    uid ? `users/${uid}/reconciliationAccounts` : undefined,
    (snapshot) =>
      snapshot.exists()
        ? parseCollection(
            snapshot.val() as Record<string, unknown>,
            firebaseToReconciliationAccount,
          )
        : NO_ACCOUNTS,
  );

  return { reconciliationAccounts: data ?? NO_ACCOUNTS, isLoading, error };
}
