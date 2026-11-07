"use client";

import {
  type AnnuityPayment,
  firebaseToAnnuityPayment,
} from "@/lib/firebase/schema/annuity-payments";
import { parseCollection } from "@/lib/firebase/schema/parse-collection";

import { useRealtimeSubscription } from "./use-realtime-subscription";

const NO_PAYMENTS: AnnuityPayment[] = [];

export function useAnnuityPayments(uid: string, annuityId: string) {
  const { data, isLoading, error } = useRealtimeSubscription(
    uid && annuityId ? `users/${uid}/annuityPayments/${annuityId}` : undefined,
    (snapshot) =>
      snapshot.exists()
        ? parseCollection(
            snapshot.val() as Record<string, unknown>,
            (id, entry) => firebaseToAnnuityPayment(id, annuityId, entry),
          )
        : NO_PAYMENTS,
  );

  return { payments: data ?? NO_PAYMENTS, isLoading, error };
}
