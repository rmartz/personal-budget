export interface FirebaseAnnuityPayment {
  amount: number;
  date: string;
  notes?: string;
}

export interface AnnuityPayment {
  id: string;
  annuityId: string;
  amount: number;
  date: Date;
  notes?: string;
}

export function annuityPaymentToFirebase(
  payment: Omit<AnnuityPayment, "id" | "annuityId">,
): FirebaseAnnuityPayment {
  return {
    amount: payment.amount,
    date: payment.date.toISOString(),
    notes: payment.notes,
  };
}

export function firebaseToAnnuityPayment(
  id: string,
  annuityId: string,
  data: FirebaseAnnuityPayment,
): AnnuityPayment {
  return {
    id,
    annuityId,
    amount: data.amount,
    date: new Date(data.date),
    notes: data.notes,
  };
}
