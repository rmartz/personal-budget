"use client";

import { Card } from "@/components/ui/card";
import { calculateRemainingPrincipal } from "@/lib/annuity-math";
import type { Annuity } from "@/lib/firebase/schema/annuities";
import { AnnuityMonthlyMode } from "@/lib/firebase/schema/annuities";

import { ANNUITY_CARD_COPY } from "./copy";
import type { AnnuityPaymentRecord } from "./types";

export type { AnnuityPaymentRecord } from "./types";

export interface AnnuityPaymentHistoryTableProps {
  annuity: Annuity;
  payments: AnnuityPaymentRecord[];
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

interface PaymentRowData {
  id: string;
  month: string;
  payment: string;
  principal: string;
  interest: string;
  balance: string;
}

function buildRows(
  annuity: Annuity,
  payments: AnnuityPaymentRecord[],
): PaymentRowData[] {
  const sorted = [...payments].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
  const isPVDerived =
    annuity.monthlyMode === AnnuityMonthlyMode.PVDerived &&
    annuity.presentValue !== undefined &&
    annuity.annualRatePercent !== undefined &&
    annuity.durationMonths !== undefined;

  return sorted.map((payment, index) => {
    const month = monthFormatter.format(payment.date);
    const paymentFormatted = currencyFormatter.format(payment.amount);

    if (
      isPVDerived &&
      annuity.presentValue !== undefined &&
      annuity.annualRatePercent !== undefined &&
      annuity.durationMonths !== undefined
    ) {
      const commonArgs = {
        annualRatePercent: annuity.annualRatePercent,
        durationMonths: annuity.durationMonths,
        presentValue: annuity.presentValue,
      };
      const balanceBefore = calculateRemainingPrincipal({
        ...commonArgs,
        monthsElapsed: index,
      });
      const balanceAfter = calculateRemainingPrincipal({
        ...commonArgs,
        monthsElapsed: index + 1,
      });
      const principal = balanceBefore - balanceAfter;
      const interest = payment.amount - principal;
      return {
        id: payment.id,
        month,
        payment: paymentFormatted,
        principal: currencyFormatter.format(principal),
        interest: currencyFormatter.format(interest),
        balance: currencyFormatter.format(balanceAfter),
      };
    }

    const balanceAfter =
      annuity.presentValue !== undefined
        ? Math.max(
            0,
            annuity.presentValue -
              sorted.slice(0, index + 1).reduce((sum, p) => sum + p.amount, 0),
          )
        : undefined;

    return {
      id: payment.id,
      month,
      payment: paymentFormatted,
      principal: ANNUITY_CARD_COPY.balanceTrendPlaceholderValue,
      interest: ANNUITY_CARD_COPY.balanceTrendPlaceholderValue,
      balance:
        balanceAfter !== undefined
          ? currencyFormatter.format(balanceAfter)
          : ANNUITY_CARD_COPY.balanceTrendPlaceholderValue,
    };
  });
}

export function AnnuityPaymentHistoryTable({
  annuity,
  payments,
}: AnnuityPaymentHistoryTableProps) {
  const rows = buildRows(annuity, payments);

  return (
    <Card>
      <div className="px-4 py-3">
        <h3 className="text-sm font-semibold">
          {ANNUITY_CARD_COPY.paymentHistoryTitle(annuity.name.toUpperCase())}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="px-4 py-2 font-medium">
                {ANNUITY_CARD_COPY.columnMonth}
              </th>
              <th className="px-4 py-2 text-right font-medium">
                {ANNUITY_CARD_COPY.columnPayment}
              </th>
              <th className="px-4 py-2 text-right font-medium">
                {ANNUITY_CARD_COPY.columnPrincipal}
              </th>
              <th className="px-4 py-2 text-right font-medium">
                {ANNUITY_CARD_COPY.columnInterest}
              </th>
              <th className="px-4 py-2 text-right font-medium">
                {ANNUITY_CARD_COPY.columnBalance}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  {ANNUITY_CARD_COPY.paymentHistoryEmpty}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b last:border-0">
                  <td className="px-4 py-2">{row.month}</td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {row.payment}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {row.principal}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {row.interest}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {row.balance}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
