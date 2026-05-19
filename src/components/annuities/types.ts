import type { AnnuityPayment } from "@/lib/firebase/schema/annuity-payments";

export type AnnuityPaymentRecord = Omit<AnnuityPayment, "annuityId">;
