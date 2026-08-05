// TODO: Implement real target-allocation data model in epic #11
// (Investment Target Allocation).

import { z } from "zod";

export enum Posture {
  Aggressive = "aggressive",
  Balanced = "balanced",
  Conservative = "conservative",
}

// The Firebase shape omits `id`; it is carried by the Firebase key
// (`users/{uid}/investmentAccounts/{accountId}`), mirroring reconciliationAccounts.
const FirebaseInvestmentAccountSchema = z.object({
  name: z.string(),
  currentPercent: z.number(),
  targetPercent: z.number(),
});

export type FirebaseInvestmentAccount = z.infer<
  typeof FirebaseInvestmentAccountSchema
>;

export interface InvestmentAccount {
  id: string;
  name: string;
  currentPercent: number;
  targetPercent: number;
}

// TODO: Define real Firebase shape when wiring lands (#8, #11)
const FirebaseAllocationTargetSchema = z.object({
  accountId: z.string(),
  accountName: z.string(),
  action: z.enum(["buy", "hold", "sell"]),
  amount: z.number(),
});

export type FirebaseAllocationTarget = z.infer<
  typeof FirebaseAllocationTargetSchema
>;

export interface AllocationTarget {
  accountId: string;
  accountName: string;
  action: "buy" | "hold" | "sell";
  amount: number;
}

export function investmentAccountToFirebase(
  account: Omit<InvestmentAccount, "id">,
): FirebaseInvestmentAccount {
  return {
    name: account.name,
    currentPercent: account.currentPercent,
    targetPercent: account.targetPercent,
  };
}

export function firebaseToInvestmentAccount(
  id: string,
  data: unknown,
): InvestmentAccount {
  const parsed = FirebaseInvestmentAccountSchema.parse(data);
  return {
    id,
    name: parsed.name,
    currentPercent: parsed.currentPercent,
    targetPercent: parsed.targetPercent,
  };
}

// TODO: Update mapper implementations when real Firebase wiring lands (#11)
export function firebaseToAllocationTarget(data: unknown): AllocationTarget {
  const parsed = FirebaseAllocationTargetSchema.parse(data);
  return {
    accountId: parsed.accountId,
    accountName: parsed.accountName,
    action: parsed.action,
    amount: parsed.amount,
  };
}
