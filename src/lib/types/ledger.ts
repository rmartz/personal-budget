export interface Ledger {
  id: string;
  name: string;
  cashCap?: number;
  cashBalance: number;
  investmentBalance: number;
}

export interface CreateLedgerInput {
  name: string;
  cashCap?: number;
}

export interface UpdateLedgerInput {
  name?: string;
  cashCap?: number | null;
}
