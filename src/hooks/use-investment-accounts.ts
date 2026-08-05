"use client";

import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

import { getClientApp } from "@/lib/firebase/client";
import {
  type FirebaseInvestmentAccount,
  firebaseToInvestmentAccount,
  type InvestmentAccount,
} from "@/lib/firebase/schema/investments";

export function useInvestmentAccounts(uid: string) {
  const [accounts, setAccounts] = useState<InvestmentAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!uid) {
      setAccounts([]);
      setIsLoading(false);
      return;
    }

    const db = getDatabase(getClientApp());
    const accountsRef = ref(db, `users/${uid}/investmentAccounts`);

    const unsubscribe = onValue(
      accountsRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setAccounts([]);
        } else {
          const data = snapshot.val() as Record<
            string,
            FirebaseInvestmentAccount
          >;
          setAccounts(
            Object.entries(data).map(([id, entry]) =>
              firebaseToInvestmentAccount(id, entry),
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

  return { accounts, isLoading, error };
}
