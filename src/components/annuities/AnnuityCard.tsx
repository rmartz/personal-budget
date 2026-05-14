"use client";

import { Card } from "@/components/ui/card";
import type { Annuity } from "@/lib/firebase/schema/annuities";
import { AnnuityMonthlyMode } from "@/lib/firebase/schema/annuities";

import { ANNUITY_CARD_COPY } from "./copy";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function monthsRemaining(startDate: Date, durationMonths: number): number {
  const now = new Date();
  const elapsed = Math.max(
    0,
    (now.getFullYear() - startDate.getFullYear()) * 12 +
      (now.getMonth() - startDate.getMonth()),
  );
  return Math.max(0, durationMonths - elapsed);
}

export interface AnnuityCardProps {
  annuity: Annuity;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function AnnuityCard({
  annuity,
  isSelected,
  onSelect,
}: AnnuityCardProps) {
  const sublabel =
    annuity.monthlyMode === AnnuityMonthlyMode.PVDerived
      ? ANNUITY_CARD_COPY.monthlyModePVDerivedSublabel
      : ANNUITY_CARD_COPY.monthlyModeFlatSublabel;

  const termDisplay =
    annuity.durationMonths !== undefined
      ? ANNUITY_CARD_COPY.termRemainingMonths(
          monthsRemaining(annuity.startDate, annuity.durationMonths),
        )
      : ANNUITY_CARD_COPY.termRemainingIndefinite;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full text-left"
      aria-pressed={isSelected}
    >
      <Card
        className={`flex flex-col gap-3 p-4 transition-colors hover:bg-muted/50 ${
          isSelected ? "ring-2 ring-primary" : ""
        }`}
      >
        <p className="text-xs font-semibold tracking-widest text-muted-foreground">
          {annuity.name.toUpperCase()}
        </p>

        <div>
          <p className="text-3xl font-bold tabular-nums">
            {currencyFormatter.format(annuity.monthlyAmount)}
          </p>
          <p className="text-xs text-muted-foreground">{sublabel}</p>
        </div>

        <dl className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              {ANNUITY_CARD_COPY.termRemainingLabel}
            </dt>
            <dd className="font-mono font-medium">{termDisplay}</dd>
          </div>
        </dl>
      </Card>
    </button>
  );
}
