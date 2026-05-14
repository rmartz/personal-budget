"use client";

import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

import { getClientApp } from "@/lib/firebase/client";
import {
  type Annuity,
  type FirebaseAnnuity,
  firebaseToAnnuity,
} from "@/lib/firebase/schema/annuities";

export function useAnnuities(uid: string) {
  const [annuities, setAnnuities] = useState<Annuity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!uid) {
      setAnnuities([]);
      setIsLoading(false);
      return;
    }

    const db = getDatabase(getClientApp());
    const annuitiesRef = ref(db, `users/${uid}/annuities`);

    const unsubscribe = onValue(
      annuitiesRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setAnnuities([]);
        } else {
          const data = snapshot.val() as Record<string, FirebaseAnnuity>;
          setAnnuities(
            Object.entries(data).map(([id, entry]) =>
              firebaseToAnnuity(id, entry),
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

  return { annuities, isLoading, error };
}
