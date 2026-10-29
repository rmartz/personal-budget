"use client";

import {
  type Annuity,
  firebaseToAnnuity,
} from "@/lib/firebase/schema/annuities";
import { parseCollection } from "@/lib/firebase/schema/parse-collection";

import { useRealtimeSubscription } from "./use-realtime-subscription";

const NO_ANNUITIES: Annuity[] = [];

export function useAnnuities(uid: string) {
  const { data, isLoading, error } = useRealtimeSubscription(
    uid ? `users/${uid}/annuities` : undefined,
    (snapshot) =>
      snapshot.exists()
        ? parseCollection(
            snapshot.val() as Record<string, unknown>,
            firebaseToAnnuity,
          )
        : NO_ANNUITIES,
  );

  return { annuities: data ?? NO_ANNUITIES, isLoading, error };
}
