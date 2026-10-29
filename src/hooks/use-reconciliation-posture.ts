"use client";

import { Posture } from "@/lib/firebase/schema/investments";
import { firebaseToUserSettings } from "@/lib/firebase/schema/user-settings";

import { useRealtimeSubscription } from "./use-realtime-subscription";

export function useReconciliationPosture(uid: string) {
  const { data, isLoading, error } = useRealtimeSubscription(
    uid ? `users/${uid}/settings/reconciliationPosture` : undefined,
    (snapshot) =>
      firebaseToUserSettings({
        reconciliationPosture: (snapshot.val() as string | null) ?? undefined,
      }).reconciliationPosture,
  );

  return { posture: data ?? Posture.Balanced, isLoading, error };
}
