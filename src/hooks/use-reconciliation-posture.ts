"use client";

import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

import { getClientApp } from "@/lib/firebase/client";
import { Posture } from "@/lib/firebase/schema/investments";
import { firebaseToUserSettings } from "@/lib/firebase/schema/user-settings";

export function useReconciliationPosture(uid: string) {
  const [posture, setPosture] = useState<Posture>(Posture.Balanced);
  const [isLoading, setIsLoading] = useState(!!uid);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!uid) {
      setPosture(Posture.Balanced);
      setError(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    const db = getDatabase(getClientApp());
    const postureRef = ref(db, `users/${uid}/settings/reconciliationPosture`);

    const unsubscribe = onValue(
      postureRef,
      (snapshot) => {
        setPosture(
          firebaseToUserSettings({
            reconciliationPosture: snapshot.val() as Posture | undefined,
          }).reconciliationPosture,
        );
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
