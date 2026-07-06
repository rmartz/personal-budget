import type { AnnuityPayment } from "@/lib/firebase/schema/annuity-payments";

export enum AnnuityMode {
  Flat = "flat",
  PV = "pv",
}

export type AnnuityPaymentRecord = Omit<AnnuityPayment, "annuityId">;
