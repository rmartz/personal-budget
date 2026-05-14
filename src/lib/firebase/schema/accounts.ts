export enum AccountTier {
  Investment = "investment",
  LongTerm = "long-term",
  Reserve = "reserve",
  ShortTerm = "short-term",
}

export interface Account {
  id: string;
  name: string;
  tier: AccountTier;
  targetFloat?: number;
}

export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
}
