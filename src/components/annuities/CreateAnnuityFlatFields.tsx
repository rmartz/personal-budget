"use client";

import { useId } from "react";

import { CREATE_ANNUITY_DIALOG_COPY } from "./copy";

export interface CreateAnnuityFlatFieldsProps {
  monthlyAmount: string;
  monthlyAmountError: string | undefined;
  onMonthlyAmountChange: (value: string) => void;
}

export function CreateAnnuityFlatFields({
  monthlyAmount,
  monthlyAmountError,
  onMonthlyAmountChange,
}: CreateAnnuityFlatFieldsProps) {
  const baseId = useId();
  const monthlyAmountInputId = `${baseId}-monthly-amount`;
  const monthlyAmountErrorId = `${baseId}-monthly-amount-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={monthlyAmountInputId}
        className="text-sm font-medium leading-none"
      >
        {CREATE_ANNUITY_DIALOG_COPY.monthlyAmountLabel}
      </label>
      <input
        id={monthlyAmountInputId}
        type="number"
        min="0.01"
        step="0.01"
        value={monthlyAmount}
        onChange={(e) => {
          onMonthlyAmountChange(e.target.value);
        }}
        placeholder={CREATE_ANNUITY_DIALOG_COPY.monthlyAmountPlaceholder}
        aria-invalid={monthlyAmountError !== undefined}
        aria-describedby={monthlyAmountError ? monthlyAmountErrorId : undefined}
        className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />
      {monthlyAmountError !== undefined && (
        <p
          id={monthlyAmountErrorId}
          role="alert"
          className="text-xs text-destructive"
        >
          {monthlyAmountError}
        </p>
      )}
    </div>
  );
}
