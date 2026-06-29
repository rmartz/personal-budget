"use client";

import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

import { getClientApp } from "@/lib/firebase/client";
import {
  type Annuity,
  firebaseToAnnuity,
} from "@/lib/firebase/schema/annuities";
import { parseCollection } from "@/lib/firebase/schema/parse-collection";

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
          const data = snapshot.val() as Record<string, unknown>;
          setAnnuities(parseCollection(data, firebaseToAnnuity));
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
