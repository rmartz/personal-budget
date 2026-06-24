import { z } from "zod";

export enum ReconciliationAccountTier {
  Investment = "investment",
  LongTerm = "long-term",
  Reserve = "reserve",
  ShortTerm = "short-term",
}

const FirebaseReconciliationAccountSchema = z.object({
  name: z.string(),
  tier: z.enum(ReconciliationAccountTier),
  targetFloat: z.number().optional(),
});

export type FirebaseReconciliationAccount = z.infer<
  typeof FirebaseReconciliationAccountSchema
>;

export interface ReconciliationAccount {
  id: string;
  name: string;
  tier: ReconciliationAccountTier;
  targetFloat?: number;
}

export function reconciliationAccountToFirebase(
  account: Omit<ReconciliationAccount, "id">,
): FirebaseReconciliationAccount {
  return {
    name: account.name,
    tier: account.tier,
    ...(account.targetFloat !== undefined
      ? { targetFloat: account.targetFloat }
      : {}),
  };
}

export function firebaseToReconciliationAccount(
  id: string,
  data: unknown,
): ReconciliationAccount {
  const parsed = FirebaseReconciliationAccountSchema.parse(data);
  return {
    id,
    name: parsed.name,
    tier: parsed.tier,
    ...(parsed.targetFloat !== undefined
      ? { targetFloat: parsed.targetFloat }
      : {}),
  };
}
