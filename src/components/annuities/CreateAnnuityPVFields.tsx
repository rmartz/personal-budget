"use client";

import { useId } from "react";

import { CREATE_ANNUITY_DIALOG_COPY } from "./copy";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export interface CreateAnnuityPVFieldsProps {
  annualRate: string;
  annualRateError: string | undefined;
  durationMonths: string;
  durationMonthsError: string | undefined;
  monthlyPreview: number | undefined;
  onAnnualRateChange: (value: string) => void;
  onDurationMonthsChange: (value: string) => void;
  onPresentValueChange: (value: string) => void;
  presentValue: string;
  presentValueError: string | undefined;
}

export function CreateAnnuityPVFields({
  annualRate,
  annualRateError,
  durationMonths,
  durationMonthsError,
  monthlyPreview,
  onAnnualRateChange,
  onDurationMonthsChange,
  onPresentValueChange,
  presentValue,
  presentValueError,
}: CreateAnnuityPVFieldsProps) {
  const baseId = useId();
  const presentValueInputId = `${baseId}-present-value`;
  const presentValueErrorId = `${baseId}-present-value-error`;
  const annualRateInputId = `${baseId}-annual-rate`;
  const annualRateErrorId = `${baseId}-annual-rate-error`;
  const durationInputId = `${baseId}-duration`;
  const durationErrorId = `${baseId}-duration-error`;

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={presentValueInputId}
          className="text-sm font-medium leading-none"
        >
          {CREATE_ANNUITY_DIALOG_COPY.presentValueLabel}
        </label>
        <input
          id={presentValueInputId}
          type="number"
          min="0.01"
          step="0.01"
          value={presentValue}
          onChange={(e) => {
            onPresentValueChange(e.target.value);
          }}
          placeholder={CREATE_ANNUITY_DIALOG_COPY.presentValuePlaceholder}
          aria-invalid={presentValueError !== undefined}
          aria-describedby={presentValueError ? presentValueErrorId : undefined}
          className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        {presentValueError !== undefined && (
          <p
            id={presentValueErrorId}
            role="alert"
            className="text-xs text-destructive"
          >
            {presentValueError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={annualRateInputId}
          className="text-sm font-medium leading-none"
        >
          {CREATE_ANNUITY_DIALOG_COPY.annualRateLabel}
        </label>
        <input
          id={annualRateInputId}
          type="number"
          min="0.01"
          step="0.01"
          value={annualRate}
          onChange={(e) => {
            onAnnualRateChange(e.target.value);
          }}
          placeholder={CREATE_ANNUITY_DIALOG_COPY.annualRatePlaceholder}
          aria-invalid={annualRateError !== undefined}
          aria-describedby={annualRateError ? annualRateErrorId : undefined}
          className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        {annualRateError !== undefined && (
          <p
            id={annualRateErrorId}
            role="alert"
            className="text-xs text-destructive"
          >
            {annualRateError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={durationInputId}
          className="text-sm font-medium leading-none"
        >
          {CREATE_ANNUITY_DIALOG_COPY.durationLabel}
        </label>
        <input
          id={durationInputId}
          type="number"
          min="1"
          step="1"
          value={durationMonths}
          onChange={(e) => {
            onDurationMonthsChange(e.target.value);
          }}
          placeholder={CREATE_ANNUITY_DIALOG_COPY.durationPlaceholder}
          aria-invalid={durationMonthsError !== undefined}
          aria-describedby={durationMonthsError ? durationErrorId : undefined}
          className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        {durationMonthsError !== undefined && (
          <p
            id={durationErrorId}
            role="alert"
            className="text-xs text-destructive"
          >
            {durationMonthsError}
          </p>
        )}
      </div>

      {monthlyPreview !== undefined && (
        <div className="rounded-lg border border-border bg-muted/50 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            {CREATE_ANNUITY_DIALOG_COPY.previewLabel}
          </p>
          <p className="mt-0.5 text-lg font-semibold">
            {currencyFormatter.format(monthlyPreview)}
            {CREATE_ANNUITY_DIALOG_COPY.perMonthSuffix}
          </p>
        </div>
      )}
    </>
  );
}
