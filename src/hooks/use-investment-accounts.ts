"use client";

import {
  type FirebaseInvestmentAccount,
  firebaseToInvestmentAccount,
  type InvestmentAccount,
} from "@/lib/firebase/schema/investments";

import { useRealtimeSubscription } from "./use-realtime-subscription";

const NO_ACCOUNTS: InvestmentAccount[] = [];

export function useInvestmentAccounts(uid: string) {
  const { data, isLoading, error } = useRealtimeSubscription(
    uid ? `users/${uid}/investmentAccounts` : undefined,
    (snapshot) =>
      snapshot.exists()
        ? Object.entries(
            snapshot.val() as Record<string, FirebaseInvestmentAccount>,
          ).map(([id, entry]) => firebaseToInvestmentAccount(id, entry))
        : NO_ACCOUNTS,
  );

  return { accounts: data ?? NO_ACCOUNTS, isLoading, error };
}
