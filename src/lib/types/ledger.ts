export interface Ledger {
  id: string;
  name: string;
  cashCap: number | undefined;
  cashBalance: number;
  investmentBalance: number;
}

export interface CreateLedgerInput {
  name: string;
  cashCap: number | undefined;
}

export interface UpdateLedgerInput {
  name?: string;
  cashCap?: number | undefined;
}
