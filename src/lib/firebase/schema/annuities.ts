export interface FirebaseAnnuity {
  name: string;
  monthlyAmount: number;
  startDate: string;
  durationMonths: number | null;
}

export interface Annuity {
  id: string;
  name: string;
  monthlyAmount: number;
  startDate: Date;
  durationMonths: number | undefined;
}

export function annuityToFirebase(
  annuity: Omit<Annuity, "id">,
): FirebaseAnnuity {
  return {
    name: annuity.name,
    monthlyAmount: annuity.monthlyAmount,
    startDate: annuity.startDate.toISOString(),
    durationMonths: annuity.durationMonths ?? null,
  };
}

export function firebaseToAnnuity(id: string, data: FirebaseAnnuity): Annuity {
  return {
    id,
    name: data.name,
    monthlyAmount: data.monthlyAmount,
    startDate: new Date(data.startDate),
    durationMonths: data.durationMonths ?? undefined,
  };
}
