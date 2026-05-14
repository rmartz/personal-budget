"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";

import { NEW_ANNUITY_DIALOG_COPY } from "./copy";

export interface NewAnnuityDialogViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (value: string) => void;
  monthlyAmount: string;
  onMonthlyAmountChange: (value: string) => void;
  durationMonths: string;
  onDurationMonthsChange: (value: string) => void;
  nameError: string | undefined;
  monthlyAmountError: string | undefined;
  submitError: string | undefined;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function NewAnnuityDialogView({
  open,
  onOpenChange,
  name,
  onNameChange,
  monthlyAmount,
  onMonthlyAmountChange,
  durationMonths,
  onDurationMonthsChange,
  nameError,
  monthlyAmountError,
  submitError,
  onSubmit,
  isSubmitting,
}: NewAnnuityDialogViewProps) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <DialogTitle>{NEW_ANNUITY_DIALOG_COPY.title}</DialogTitle>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium"
                  htmlFor="new-annuity-name"
                >
                  {NEW_ANNUITY_DIALOG_COPY.nameLabel}
                </label>
                <input
                  id="new-annuity-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    onNameChange(e.target.value);
                  }}
                  placeholder={NEW_ANNUITY_DIALOG_COPY.namePlaceholder}
                  aria-invalid={nameError !== undefined}
                  aria-describedby={
                    nameError !== undefined
                      ? "new-annuity-name-error"
                      : undefined
                  }
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 aria-invalid:border-destructive"
                />
                {nameError !== undefined && (
                  <p
                    id="new-annuity-name-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {nameError}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium"
                  htmlFor="new-annuity-monthly-amount"
                >
                  {NEW_ANNUITY_DIALOG_COPY.monthlyAmountLabel}
                </label>
                <input
                  id="new-annuity-monthly-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={monthlyAmount}
                  onChange={(e) => {
                    onMonthlyAmountChange(e.target.value);
                  }}
                  placeholder={NEW_ANNUITY_DIALOG_COPY.monthlyAmountPlaceholder}
                  aria-invalid={monthlyAmountError !== undefined}
                  aria-describedby={
                    monthlyAmountError !== undefined
                      ? "new-annuity-monthly-amount-error"
                      : undefined
                  }
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 aria-invalid:border-destructive"
                />
                {monthlyAmountError !== undefined && (
                  <p
                    id="new-annuity-monthly-amount-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {monthlyAmountError}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium"
                  htmlFor="new-annuity-duration-months"
                >
                  {NEW_ANNUITY_DIALOG_COPY.durationMonthsLabel}
                </label>
                <input
                  id="new-annuity-duration-months"
                  type="number"
                  min="1"
                  step="1"
                  value={durationMonths}
                  onChange={(e) => {
                    onDurationMonthsChange(e.target.value);
                  }}
                  placeholder={
                    NEW_ANNUITY_DIALOG_COPY.durationMonthsPlaceholder
                  }
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
                />
              </div>
            </div>
            {submitError !== undefined && (
              <p role="alert" className="mt-2 text-sm text-destructive">
                {submitError}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <DialogClose
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
                disabled={isSubmitting}
              >
                {NEW_ANNUITY_DIALOG_COPY.cancelButton}
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {NEW_ANNUITY_DIALOG_COPY.submitButton}
              </Button>
            </div>
          </form>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  );
}

export interface NewAnnuityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    name: string,
    monthlyAmount: number,
    durationMonths: number | undefined,
  ) => Promise<unknown>;
}

export function NewAnnuityDialog({
  open,
  onOpenChange,
  onSubmit,
}: NewAnnuityDialogProps) {
  const [name, setName] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [durationMonths, setDurationMonths] = useState("");
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [monthlyAmountError, setMonthlyAmountError] = useState<
    string | undefined
  >(undefined);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && isSubmitting) return;
    if (!nextOpen) {
      setName("");
      setMonthlyAmount("");
      setDurationMonths("");
      setNameError(undefined);
      setMonthlyAmountError(undefined);
      setSubmitError(undefined);
    }
    onOpenChange(nextOpen);
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    setSubmitError(undefined);
    let valid = true;

    if (name.trim() === "") {
      setNameError(NEW_ANNUITY_DIALOG_COPY.nameRequiredError);
      valid = false;
    } else {
      setNameError(undefined);
    }

    let parsedAmount: number | undefined;
    if (monthlyAmount.trim() === "") {
      setMonthlyAmountError(NEW_ANNUITY_DIALOG_COPY.monthlyAmountRequiredError);
      valid = false;
    } else {
      const parsed = parseFloat(monthlyAmount);
      if (isNaN(parsed) || parsed <= 0) {
        setMonthlyAmountError(
          NEW_ANNUITY_DIALOG_COPY.monthlyAmountInvalidError,
        );
        valid = false;
      } else {
        setMonthlyAmountError(undefined);
        parsedAmount = parsed;
      }
    }

    let parsedDuration: number | undefined;
    if (durationMonths.trim() !== "") {
      parsedDuration = parseInt(durationMonths, 10);
    }

    if (!valid || parsedAmount === undefined) return;

    setIsSubmitting(true);
    try {
      await onSubmit(name.trim(), parsedAmount, parsedDuration);
      handleOpenChange(false);
    } catch {
      setSubmitError(NEW_ANNUITY_DIALOG_COPY.submitError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <NewAnnuityDialogView
      open={open}
      onOpenChange={handleOpenChange}
      name={name}
      onNameChange={setName}
      monthlyAmount={monthlyAmount}
      onMonthlyAmountChange={setMonthlyAmount}
      durationMonths={durationMonths}
      onDurationMonthsChange={setDurationMonths}
      nameError={nameError}
      monthlyAmountError={monthlyAmountError}
      submitError={submitError}
      onSubmit={() => void handleSubmit()}
      isSubmitting={isSubmitting}
    />
  );
}
