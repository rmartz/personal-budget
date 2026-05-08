export interface CalculateMonthlyPaymentInput {
  presentValue: number;
  annualRatePercent: number;
  durationMonths: number;
}

/**
 * Calculates the monthly payment for an annuity using the standard present-value formula:
 *   PMT = PV * r / (1 - (1 + r)^(-n))
 * where r = monthly interest rate and n = number of payments.
 * When rate is 0, returns PV / n.
 */
export function calculateMonthlyPayment({
  presentValue,
  annualRatePercent,
  durationMonths,
}: CalculateMonthlyPaymentInput): number {
  const r = annualRatePercent / 100 / 12;
  if (r === 0) {
    return presentValue / durationMonths;
  }
  return (presentValue * r) / (1 - Math.pow(1 + r, -durationMonths));
}
