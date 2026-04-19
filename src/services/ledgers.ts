import type { CreateLedgerInput, Ledger, UpdateLedgerInput } from "@/lib/types";

// TODO: implement all functions with Firebase

export function getLedgers(uid: string): Promise<Ledger[]> {
  void uid;
  return Promise.resolve([]);
}

export function createLedger(
  uid: string,
  data: CreateLedgerInput,
): Promise<Ledger> {
  void uid;
  void data;
  return Promise.reject(new Error("Not implemented"));
}

export function updateLedger(
  uid: string,
  id: string,
  data: UpdateLedgerInput,
): Promise<void> {
  void uid;
  void id;
  void data;
  return Promise.reject(new Error("Not implemented"));
}

export function deleteLedger(uid: string, id: string): Promise<void> {
  void uid;
  void id;
  return Promise.reject(new Error("Not implemented"));
}
