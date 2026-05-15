"use client";

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
  onEdit?: () => void;
  onDelete?: () => void;
}

export function AnnuityCard({
  annuity,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
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
    <div
      className={`relative w-full rounded-lg border bg-card text-card-foreground shadow-sm ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-label={ANNUITY_CARD_COPY.selectAriaLabel}
        aria-pressed={isSelected}
        className="flex w-full flex-col gap-3 p-4 text-left transition-colors hover:bg-muted/50"
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
      </button>

      {(onEdit !== undefined || onDelete !== undefined) && (
        <div className="absolute right-2 top-2 flex gap-1">
          {onEdit !== undefined && (
            <button
              type="button"
              aria-label={ANNUITY_CARD_COPY.editAriaLabel}
              onClick={onEdit}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
          {onDelete !== undefined && (
            <button
              type="button"
              aria-label={ANNUITY_CARD_COPY.deleteAriaLabel}
              onClick={onDelete}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
