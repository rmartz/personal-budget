export enum ReconciliationAccountTier {
  Investment = "investment",
  LongTerm = "long-term",
  Reserve = "reserve",
  ShortTerm = "short-term",
}

export interface FirebaseReconciliationAccount {
  name: string;
  tier: ReconciliationAccountTier;
  targetFloat?: number;
}

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
  data: FirebaseReconciliationAccount,
): ReconciliationAccount {
  return {
    id,
    name: data.name,
    tier: data.tier,
    ...(data.targetFloat !== undefined
      ? { targetFloat: data.targetFloat }
      : {}),
  };
}
