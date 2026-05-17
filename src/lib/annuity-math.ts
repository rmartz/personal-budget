export interface CalculateMonthlyPaymentInput {
  annualRatePercent: number;
  durationMonths: number;
  presentValue: number;
}

/**
 * Calculates the monthly payment for an annuity using the standard present-value formula:
 *   PMT = PV * r / (1 - (1 + r)^(-n))
 * where r = monthly interest rate and n = number of payments.
 * When rate is 0, returns PV / n.
 */
export function calculateMonthlyPayment({
  annualRatePercent,
  durationMonths,
  presentValue,
}: CalculateMonthlyPaymentInput): number {
  const r = annualRatePercent / 100 / 12;
  if (r === 0) {
    return presentValue / durationMonths;
  }
  return (presentValue * r) / (1 - Math.pow(1 + r, -durationMonths));
}

export interface CalculateRemainingPrincipalInput {
  annualRatePercent: number;
  durationMonths: number;
  monthsElapsed: number;
  presentValue: number;
}

/**
 * Calculates the remaining outstanding principal balance after `monthsElapsed` payments
 * using the standard amortisation formula:
 *   B(n) = PV*(1+r)^n - PMT*((1+r)^n - 1)/r
 * where r = monthly interest rate, n = monthsElapsed, and PMT = calculateMonthlyPayment(...).
 * When rate is 0, returns PV - PMT * n.
 */
export function calculateRemainingPrincipal({
  annualRatePercent,
  durationMonths,
  monthsElapsed,
  presentValue,
}: CalculateRemainingPrincipalInput): number {
  const r = annualRatePercent / 100 / 12;
  const pmt = calculateMonthlyPayment({
    annualRatePercent,
    durationMonths,
    presentValue,
  });
  if (r === 0) {
    return presentValue - pmt * monthsElapsed;
  }
  const factor = Math.pow(1 + r, monthsElapsed);
  return presentValue * factor - (pmt * (factor - 1)) / r;
}
