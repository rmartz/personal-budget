import {
  type Annuity,
  AnnuityMonthlyMode,
} from "@/lib/firebase/schema/annuities";

import { calculateRemainingPrincipal } from "./annuity-math";

interface AnnuityPaymentLike {
  amount: number;
}

/**
 * Computes the remaining principal balance for an annuity given its payment history.
 *
 * For PV-derived annuities: applies the standard amortisation formula using the
 * number of payments made as `monthsElapsed`.
 *
 * For flat annuities with a known `presentValue`: returns presentValue minus the
 * sum of all recorded payment amounts, clamped to 0.
 *
 * Returns `undefined` when the annuity has no `presentValue` to compute against.
 */
export function computeRemainingBalance(
  annuity: Annuity,
  payments: AnnuityPaymentLike[],
): number | undefined {
  if (annuity.presentValue === undefined) {
    return undefined;
  }

  if (
    annuity.monthlyMode === AnnuityMonthlyMode.PVDerived &&
    annuity.annualRatePercent !== undefined &&
    annuity.durationMonths !== undefined
  ) {
    return calculateRemainingPrincipal({
      annualRatePercent: annuity.annualRatePercent,
      durationMonths: annuity.durationMonths,
      monthsElapsed: payments.length,
      presentValue: annuity.presentValue,
    });
  }

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  return Math.max(0, annuity.presentValue - totalPaid);
}

/**
 * Computes the remaining term (in months) for an annuity given its payment history.
 *
 * Returns `durationMonths - payments.length`, clamped to 0.
 * Returns `undefined` when `durationMonths` is undefined (indefinite annuity).
 */
export function computeRemainingTerm(
  annuity: Annuity,
  payments: AnnuityPaymentLike[],
): number | undefined {
  if (annuity.durationMonths === undefined) {
    return undefined;
  }
  return Math.max(0, annuity.durationMonths - payments.length);
}
