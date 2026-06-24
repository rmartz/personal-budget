import { z } from "zod";

const FirebaseAnnuityPaymentSchema = z.object({
  amount: z.number(),
  date: z.string(),
  notes: z.string().optional(),
});

export type FirebaseAnnuityPayment = z.infer<
  typeof FirebaseAnnuityPaymentSchema
>;

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
    ...(payment.notes !== undefined && { notes: payment.notes }),
  };
}

export function firebaseToAnnuityPayment(
  id: string,
  annuityId: string,
  data: unknown,
): AnnuityPayment {
  const parsed = FirebaseAnnuityPaymentSchema.parse(data);
  return {
    id,
    annuityId,
    amount: parsed.amount,
    date: new Date(parsed.date),
    notes: parsed.notes,
  };
}
