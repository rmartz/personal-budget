export enum AnnuityMonthlyMode {
  Flat = "flat",
  PVDerived = "pv-derived",
}

export interface FirebaseAnnuity {
  annualRatePercent?: number;
  durationMonths: number | null;
  monthlyAmount: number;
  monthlyMode?: AnnuityMonthlyMode;
  name: string;
  presentValue?: number;
  startDate: string;
}

export interface Annuity {
  annualRatePercent?: number;
  durationMonths: number | undefined;
  id: string;
  monthlyAmount: number;
  monthlyMode: AnnuityMonthlyMode;
  name: string;
  presentValue?: number;
  startDate: Date;
}

export function annuityToFirebase(
  annuity: Omit<Annuity, "id">,
): FirebaseAnnuity {
  return {
    annualRatePercent: annuity.annualRatePercent,
    durationMonths: annuity.durationMonths ?? null,
    monthlyAmount: annuity.monthlyAmount,
    monthlyMode: annuity.monthlyMode,
    name: annuity.name,
    presentValue: annuity.presentValue,
    startDate: annuity.startDate.toISOString(),
  };
}

export function firebaseToAnnuity(id: string, data: FirebaseAnnuity): Annuity {
  return {
    annualRatePercent: data.annualRatePercent,
    durationMonths: data.durationMonths ?? undefined,
    id,
    monthlyAmount: data.monthlyAmount,
    monthlyMode: data.monthlyMode ?? AnnuityMonthlyMode.Flat,
    name: data.name,
    presentValue: data.presentValue,
    startDate: new Date(data.startDate),
  };
}
