import { get, getDatabase, push, ref, remove, set } from "firebase/database";

import { getClientApp } from "@/lib/firebase/client";
import {
  type AnnuityPayment,
  annuityPaymentToFirebase,
  type FirebaseAnnuityPayment,
  firebaseToAnnuityPayment,
} from "@/lib/firebase/schema/annuity-payments";

function db() {
  return getDatabase(getClientApp());
}

function annuityPaymentsRef(uid: string, annuityId: string) {
  return ref(db(), `users/${uid}/annuityPayments/${annuityId}`);
}

function annuityPaymentRef(uid: string, annuityId: string, id: string) {
  return ref(db(), `users/${uid}/annuityPayments/${annuityId}/${id}`);
}

export async function getAnnuityPayments(
  uid: string,
  annuityId: string,
): Promise<AnnuityPayment[]> {
  const snapshot = await get(annuityPaymentsRef(uid, annuityId));
  if (!snapshot.exists()) {
    return [];
  }
  const data = snapshot.val() as Record<string, FirebaseAnnuityPayment>;
  return Object.entries(data).map(([id, entry]) =>
    firebaseToAnnuityPayment(id, annuityId, entry),
  );
}

export async function createAnnuityPayment(
  uid: string,
  annuityId: string,
  data: Omit<AnnuityPayment, "id" | "annuityId">,
): Promise<AnnuityPayment> {
  const newRef = push(annuityPaymentsRef(uid, annuityId));
  if (!newRef.key) {
    throw new Error("Failed to generate annuity payment key");
  }
  await set(newRef, annuityPaymentToFirebase(data));
  return { id: newRef.key, annuityId, ...data };
}

export async function deleteAnnuityPayment(
  uid: string,
  annuityId: string,
  id: string,
): Promise<void> {
  await remove(annuityPaymentRef(uid, annuityId, id));
}
