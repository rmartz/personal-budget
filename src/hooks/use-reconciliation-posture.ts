"use client";

import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

import { getClientApp } from "@/lib/firebase/client";
import { Posture } from "@/lib/firebase/schema/investments";
import {
  firebaseToUserSettings,
  type FirebaseUserSettings,
} from "@/lib/firebase/schema/user-settings";

export function useReconciliationPosture(uid: string) {
  const [posture, setPosture] = useState<Posture>(Posture.Balanced);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!uid) {
      setPosture(Posture.Balanced);
      setIsLoading(false);
      return;
    }

    const db = getDatabase(getClientApp());
    const settingsRef = ref(db, `users/${uid}/settings`);

    const unsubscribe = onValue(
      settingsRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setPosture(Posture.Balanced);
        } else {
          const data = snapshot.val() as FirebaseUserSettings;
          setPosture(firebaseToUserSettings(data).reconciliationPosture);
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

  return { posture, isLoading, error };
}
