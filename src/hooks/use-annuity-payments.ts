"use client";

import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

import { getClientApp } from "@/lib/firebase/client";
import {
  type AnnuityPayment,
  firebaseToAnnuityPayment,
} from "@/lib/firebase/schema/annuity-payments";
import { parseCollection } from "@/lib/firebase/schema/parse-collection";

export function useAnnuityPayments(uid: string, annuityId: string) {
  const [payments, setPayments] = useState<AnnuityPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!uid || !annuityId) {
      setError(undefined);
      setPayments([]);
      setIsLoading(false);
      return;
    }

    setError(undefined);
    setIsLoading(true);

    const db = getDatabase(getClientApp());
    const paymentsRef = ref(db, `users/${uid}/annuityPayments/${annuityId}`);

    const unsubscribe = onValue(
      paymentsRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setPayments([]);
        } else {
          const data = snapshot.val() as Record<string, unknown>;
          setPayments(
            parseCollection(data, (id, entry) =>
              firebaseToAnnuityPayment(id, annuityId, entry),
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
  }, [uid, annuityId]);

  return { payments, isLoading, error };
}
