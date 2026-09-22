import type { BudgetLedger } from "@/lib/firebase/schema/budget-ledgers";
import type { CreateLedgerInput, Ledger, UpdateLedgerInput } from "@/lib/types";

/**
 * Client access to budget ledgers. The UI talks to the `/api/ledgers` BE
 * endpoints (which own the Firebase Admin SDK and, in future, read-time schema
 * migrations) rather than Firebase directly. The authenticated user is derived
 * server-side from the session cookie, so these functions take no `uid`.
 */

async function requestJson<T>(input: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  const response = await fetch(input, { ...init, headers });
  if (!response.ok) {
    throw new Error(`Ledger request failed: ${String(response.status)}`);
  }
  return response.json() as Promise<T>;
}

function toLedger(stored: BudgetLedger): Ledger {
  return { ...stored, cashBalance: 0, investmentBalance: 0 };
}

export async function getLedgers(): Promise<Ledger[]> {
  const { ledgers } = await requestJson<{ ledgers: BudgetLedger[] }>(
    "/api/ledgers",
  );
  return ledgers.map(toLedger);
}

export async function createLedger(data: CreateLedgerInput): Promise<Ledger> {
  const { ledger } = await requestJson<{ ledger: BudgetLedger }>(
    "/api/ledgers",
    { method: "POST", body: JSON.stringify(data) },
  );
  return toLedger(ledger);
}

export async function updateLedger(
  id: string,
  data: UpdateLedgerInput,
): Promise<void> {
  await requestJson<{ ledger: BudgetLedger }>(
    `/api/ledgers/${encodeURIComponent(id)}`,
    { method: "PATCH", body: JSON.stringify(data) },
  );
}

export async function deleteLedger(id: string): Promise<void> {
  const response = await fetch(`/api/ledgers/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Ledger request failed: ${String(response.status)}`);
  }
}
