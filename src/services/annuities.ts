import {
  getDatabase,
  ref,
  get,
  set,
  update,
  push,
  remove,
} from "firebase/database";
import { getClientApp } from "@/lib/firebase/client";
import {
  annuityToFirebase,
  firebaseToAnnuity,
  type FirebaseAnnuity,
  type Annuity,
} from "@/lib/firebase/schema/annuities";

function db() {
  return getDatabase(getClientApp());
}

function annuitiesRef(uid: string) {
  return ref(db(), `users/${uid}/annuities`);
}

function annuityRef(uid: string, id: string) {
  return ref(db(), `users/${uid}/annuities/${id}`);
}

export async function getAnnuities(uid: string): Promise<Annuity[]> {
  const snapshot = await get(annuitiesRef(uid));
  if (!snapshot.exists()) {
    return [];
  }
  const data = snapshot.val() as Record<string, FirebaseAnnuity>;
  return Object.entries(data).map(([id, entry]) =>
    firebaseToAnnuity(id, entry),
  );
}

export async function createAnnuity(
  uid: string,
  data: Omit<Annuity, "id">,
): Promise<Annuity> {
  const newRef = push(annuitiesRef(uid));
  if (!newRef.key) {
    throw new Error("Failed to generate annuity key");
  }
  await set(newRef, annuityToFirebase(data));
  return { id: newRef.key, ...data };
}

export async function updateAnnuity(
  uid: string,
  id: string,
  data: Partial<Omit<Annuity, "id">>,
): Promise<void> {
  const updates: Partial<FirebaseAnnuity> = {};
  if (data.name !== undefined) {
    updates.name = data.name;
  }
  if (data.monthlyAmount !== undefined) {
    updates.monthlyAmount = data.monthlyAmount;
  }
  if (data.startDate !== undefined) {
    updates.startDate = data.startDate.toISOString();
  }
  if ("durationMonths" in data) {
    updates.durationMonths = data.durationMonths ?? null;
  }
  if (data.monthlyMode !== undefined) {
    updates.monthlyMode = data.monthlyMode;
  }
  await update(annuityRef(uid, id), updates);
}

export async function deleteAnnuity(uid: string, id: string): Promise<void> {
  await remove(annuityRef(uid, id));
}
