import { z } from "zod";

export enum AnnuityMonthlyMode {
  Flat = "flat",
  PVDerived = "pv-derived",
}

const FirebaseAnnuitySchema = z.object({
  annualRatePercent: z.number().optional(),
  durationMonths: z.number().nullable(),
  monthlyAmount: z.number(),
  monthlyMode: z.enum(AnnuityMonthlyMode).optional(),
  name: z.string(),
  presentValue: z.number().optional(),
  startDate: z.string(),
});

export type FirebaseAnnuity = z.infer<typeof FirebaseAnnuitySchema>;

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

export function firebaseToAnnuity(id: string, data: unknown): Annuity {
  const parsed = FirebaseAnnuitySchema.parse(data);
  return {
    annualRatePercent: parsed.annualRatePercent,
    durationMonths: parsed.durationMonths ?? undefined,
    id,
    monthlyAmount: parsed.monthlyAmount,
    monthlyMode: parsed.monthlyMode ?? AnnuityMonthlyMode.Flat,
    name: parsed.name,
    presentValue: parsed.presentValue,
    startDate: new Date(parsed.startDate),
  };
}
