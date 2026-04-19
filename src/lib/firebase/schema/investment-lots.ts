export enum InvestmentLotType {
  Purchase = "purchase",
  Sale = "sale",
}

export interface FirebaseInvestmentLot {
  type: InvestmentLotType;
  date: string;
  units: number;
  pricePerUnit: number;
}

export interface InvestmentLot {
  id: string;
  ledgerId: string;
  type: InvestmentLotType;
  date: Date;
  units: number;
  pricePerUnit: number;
}

export function investmentLotToFirebase(
  lot: Omit<InvestmentLot, "id" | "ledgerId">,
): FirebaseInvestmentLot {
  return {
    type: lot.type,
    date: lot.date.toISOString(),
    units: lot.units,
    pricePerUnit: lot.pricePerUnit,
  };
}

export function firebaseToInvestmentLot(
  id: string,
  ledgerId: string,
  data: FirebaseInvestmentLot,
): InvestmentLot {
  return {
    id,
    ledgerId,
    type: data.type,
    date: new Date(data.date),
    units: data.units,
    pricePerUnit: data.pricePerUnit,
  };
}
