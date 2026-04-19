export enum InvestmentLotType {
  Purchase = "purchase",
  Sale = "sale",
}

export interface InvestmentLedger {
  id: string;
  name: string;
  targetAllocationPercent: number | undefined;
  currentBalance: number;
}

export interface InvestmentLot {
  id: string;
  ledgerId: string;
  type: InvestmentLotType;
  date: Date;
  units: number;
  pricePerUnit: number;
}

export interface CreateInvestmentLedgerInput {
  name: string;
  targetAllocationPercent: number | undefined;
}

export interface UpdateInvestmentLedgerInput {
  name?: string;
  targetAllocationPercent?: number | undefined;
}
