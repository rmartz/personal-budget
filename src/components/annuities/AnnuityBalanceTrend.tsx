"use client";

import { Card } from "@/components/ui/card";
import { calculateRemainingPrincipal } from "@/lib/annuity-math";
import type { Annuity } from "@/lib/firebase/schema/annuities";
import { AnnuityMonthlyMode } from "@/lib/firebase/schema/annuities";

import { ANNUITY_CARD_COPY } from "./copy";
import type { AnnuityPaymentRecord } from "./types";

export interface AnnuityBalanceTrendProps {
  annuity: Annuity;
  payments: AnnuityPaymentRecord[];
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const placeholder = ANNUITY_CARD_COPY.balanceTrendPlaceholderValue;

export function AnnuityBalanceTrend({
  annuity,
  payments,
}: AnnuityBalanceTrendProps) {
  const startedValue =
    annuity.presentValue !== undefined
      ? currencyFormatter.format(annuity.presentValue)
      : placeholder;

  const nowValue =
    annuity.presentValue !== undefined &&
    annuity.monthlyMode === AnnuityMonthlyMode.PVDerived &&
    annuity.annualRatePercent !== undefined &&
    annuity.durationMonths !== undefined
      ? currencyFormatter.format(
          calculateRemainingPrincipal({
            annualRatePercent: annuity.annualRatePercent,
            durationMonths: annuity.durationMonths,
            monthsElapsed: payments.length,
            presentValue: annuity.presentValue,
          }),
        )
      : annuity.presentValue !== undefined
        ? currencyFormatter.format(
            Math.max(
              0,
              annuity.presentValue -
                payments.reduce((sum, p) => sum + p.amount, 0),
            ),
          )
        : placeholder;

  const payoffValue =
    annuity.durationMonths !== undefined
      ? ANNUITY_CARD_COPY.termRemainingMonths(
          Math.max(0, annuity.durationMonths - payments.length),
        )
      : placeholder;

  return (
    <Card className="flex flex-col gap-4 p-4">
      <h3 className="text-sm font-semibold">
        {ANNUITY_CARD_COPY.balanceTrendTitle(annuity.name.toUpperCase())}
      </h3>
      {/* TODO: Replace with Recharts or similar chart library in epic #16 (Annuity Monthly Tracking) */}
      <div
        role="img"
        aria-label={ANNUITY_CARD_COPY.balanceTrendChartPlaceholder}
        className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-muted text-sm text-muted-foreground"
      >
        {ANNUITY_CARD_COPY.balanceTrendChartPlaceholder}
      </div>
      <div className="grid grid-cols-3 divide-x text-center text-sm">
        <div className="px-2">
          <p className="text-xs text-muted-foreground">
            {ANNUITY_CARD_COPY.balanceTrendStartedLabel}
          </p>
          <p className="font-medium">{startedValue}</p>
        </div>
        <div className="px-2">
          <p className="text-xs text-muted-foreground">
            {ANNUITY_CARD_COPY.balanceTrendNowLabel}
          </p>
          <p className="font-medium">{nowValue}</p>
        </div>
        <div className="px-2">
          <p className="text-xs text-muted-foreground">
            {ANNUITY_CARD_COPY.balanceTrendPayoffLabel}
          </p>
          <p className="font-medium">{payoffValue}</p>
        </div>
      </div>
    </Card>
  );
}
