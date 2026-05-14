export enum AnnuityMonthlyMode {
  Flat = "flat",
  PVDerived = "pv-derived",
}

export interface FirebaseAnnuity {
  name: string;
  monthlyAmount: number;
  startDate: string;
  durationMonths: number | null;
  monthlyMode?: AnnuityMonthlyMode;
}

export interface Annuity {
  id: string;
  name: string;
  monthlyAmount: number;
  startDate: Date;
  durationMonths: number | undefined;
  monthlyMode: AnnuityMonthlyMode;
}

export function annuityToFirebase(
  annuity: Omit<Annuity, "id">,
): FirebaseAnnuity {
  return {
    name: annuity.name,
    monthlyAmount: annuity.monthlyAmount,
    startDate: annuity.startDate.toISOString(),
    durationMonths: annuity.durationMonths ?? null,
    monthlyMode: annuity.monthlyMode,
  };
}

export function firebaseToAnnuity(id: string, data: FirebaseAnnuity): Annuity {
  return {
    id,
    name: data.name,
    monthlyAmount: data.monthlyAmount,
    startDate: new Date(data.startDate),
    durationMonths: data.durationMonths ?? undefined,
    monthlyMode: data.monthlyMode ?? AnnuityMonthlyMode.Flat,
  };
}
