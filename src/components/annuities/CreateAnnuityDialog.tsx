"use client";

import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { calculateMonthlyPayment } from "@/lib/annuity-math";
import { AnnuityMonthlyMode } from "@/lib/firebase/schema/annuities";

import { CREATE_ANNUITY_DIALOG_COPY } from "./copy";

type AnnuityMode = "flat" | "pv";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export interface CreateAnnuityInput {
  annualRatePercent: number | undefined;
  durationMonths: number | undefined;
  monthlyAmount: number;
  monthlyMode: AnnuityMonthlyMode;
  name: string;
  presentValue: number | undefined;
}

export interface CreateAnnuityDialogViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: AnnuityMode;
  onModeChange: (mode: AnnuityMode) => void;
  name: string;
  onNameChange: (value: string) => void;
  monthlyAmount: string;
  onMonthlyAmountChange: (value: string) => void;
  presentValue: string;
  onPresentValueChange: (value: string) => void;
  annualRate: string;
  onAnnualRateChange: (value: string) => void;
  durationMonths: string;
  onDurationMonthsChange: (value: string) => void;
  monthlyPreview: number | undefined;
  nameError: string | undefined;
  monthlyAmountError: string | undefined;
  presentValueError: string | undefined;
  annualRateError: string | undefined;
  durationMonthsError: string | undefined;
  submitError: string | undefined;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function CreateAnnuityDialogView({
  open,
  onOpenChange,
  mode,
  onModeChange,
  name,
  onNameChange,
  monthlyAmount,
  onMonthlyAmountChange,
  presentValue,
  onPresentValueChange,
  annualRate,
  onAnnualRateChange,
  durationMonths,
  onDurationMonthsChange,
  monthlyPreview,
  nameError,
  monthlyAmountError,
  presentValueError,
  annualRateError,
  durationMonthsError,
  submitError,
  onSubmit,
  isSubmitting,
}: CreateAnnuityDialogViewProps) {
  const baseId = useId();
  const nameInputId = `${baseId}-name`;
  const nameErrorId = `${baseId}-name-error`;
  const monthlyAmountInputId = `${baseId}-monthly-amount`;
  const monthlyAmountErrorId = `${baseId}-monthly-amount-error`;
  const presentValueInputId = `${baseId}-present-value`;
  const presentValueErrorId = `${baseId}-present-value-error`;
  const annualRateInputId = `${baseId}-annual-rate`;
  const annualRateErrorId = `${baseId}-annual-rate-error`;
  const durationInputId = `${baseId}-duration`;
  const durationErrorId = `${baseId}-duration-error`;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen: boolean) => {
        if (!isOpen && isSubmitting) return;
        onOpenChange(isOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{CREATE_ANNUITY_DIALOG_COPY.title}</DialogTitle>
        </DialogHeader>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="flex flex-col gap-4 py-2">
            {/* Mode toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onModeChange("flat");
                }}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  mode === "flat"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                {CREATE_ANNUITY_DIALOG_COPY.modeFlatButton}
              </button>
              <button
                type="button"
                onClick={() => {
                  onModeChange("pv");
                }}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  mode === "pv"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                {CREATE_ANNUITY_DIALOG_COPY.modeLoanButton}
              </button>
            </div>

            {/* Name field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={nameInputId}
                className="text-sm font-medium leading-none"
              >
                {CREATE_ANNUITY_DIALOG_COPY.nameLabel}
              </label>
              <input
                id={nameInputId}
                type="text"
                value={name}
                onChange={(e) => {
                  onNameChange(e.target.value);
                }}
                placeholder={CREATE_ANNUITY_DIALOG_COPY.namePlaceholder}
                aria-invalid={nameError !== undefined}
                aria-describedby={nameError ? nameErrorId : undefined}
                className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              {nameError !== undefined && (
                <p
                  id={nameErrorId}
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {nameError}
                </p>
              )}
            </div>

            {/* Flat mode: monthly amount */}
            {mode === "flat" && (
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
                  placeholder={
                    CREATE_ANNUITY_DIALOG_COPY.monthlyAmountPlaceholder
                  }
                  aria-invalid={monthlyAmountError !== undefined}
                  aria-describedby={
                    monthlyAmountError ? monthlyAmountErrorId : undefined
                  }
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
            )}

            {/* PV mode: present value, annual rate, duration */}
            {mode === "pv" && (
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
                    placeholder={
                      CREATE_ANNUITY_DIALOG_COPY.presentValuePlaceholder
                    }
                    aria-invalid={presentValueError !== undefined}
                    aria-describedby={
                      presentValueError ? presentValueErrorId : undefined
                    }
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
                    min="0"
                    step="0.01"
                    value={annualRate}
                    onChange={(e) => {
                      onAnnualRateChange(e.target.value);
                    }}
                    placeholder={
                      CREATE_ANNUITY_DIALOG_COPY.annualRatePlaceholder
                    }
                    aria-invalid={annualRateError !== undefined}
                    aria-describedby={
                      annualRateError ? annualRateErrorId : undefined
                    }
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
                    aria-describedby={
                      durationMonthsError ? durationErrorId : undefined
                    }
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

                {/* Live preview */}
                {monthlyPreview !== undefined && (
                  <div className="rounded-lg border border-border bg-muted/50 px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                      {CREATE_ANNUITY_DIALOG_COPY.previewLabel}
                    </p>
                    <p className="mt-0.5 text-lg font-semibold">
                      {currencyFormatter.format(monthlyPreview)}/mo
                    </p>
                  </div>
                )}
              </>
            )}

            {submitError !== undefined && (
              <p role="alert" className="text-xs text-destructive">
                {submitError}
              </p>
            )}
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              {CREATE_ANNUITY_DIALOG_COPY.cancelButton}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? CREATE_ANNUITY_DIALOG_COPY.creatingButton
                : CREATE_ANNUITY_DIALOG_COPY.submitButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export interface CreateAnnuityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateAnnuityInput) => Promise<void>;
}

export function CreateAnnuityDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateAnnuityDialogProps) {
  const [mode, setMode] = useState<AnnuityMode>("flat");
  const [name, setName] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [presentValue, setPresentValue] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [durationMonths, setDurationMonths] = useState("");

  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [monthlyAmountError, setMonthlyAmountError] = useState<
    string | undefined
  >(undefined);
  const [presentValueError, setPresentValueError] = useState<
    string | undefined
  >(undefined);
  const [annualRateError, setAnnualRateError] = useState<string | undefined>(
    undefined,
  );
  const [durationMonthsError, setDurationMonthsError] = useState<
    string | undefined
  >(undefined);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute live preview for PV mode
  const pvNum = parseFloat(presentValue);
  const rateNum = parseFloat(annualRate);
  const durNum = parseInt(durationMonths, 10);
  const monthlyPreview =
    mode === "pv" &&
    presentValue.trim() !== "" &&
    annualRate.trim() !== "" &&
    durationMonths.trim() !== "" &&
    !isNaN(pvNum) &&
    pvNum > 0 &&
    !isNaN(rateNum) &&
    rateNum > 0 &&
    !isNaN(durNum) &&
    durNum > 0
      ? calculateMonthlyPayment({
          presentValue: pvNum,
          annualRatePercent: rateNum,
          durationMonths: durNum,
        })
      : undefined;

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && isSubmitting) return;
    if (!nextOpen) {
      setMode("flat");
      setName("");
      setMonthlyAmount("");
      setPresentValue("");
      setAnnualRate("");
      setDurationMonths("");
      setNameError(undefined);
      setMonthlyAmountError(undefined);
      setPresentValueError(undefined);
      setAnnualRateError(undefined);
      setDurationMonthsError(undefined);
      setSubmitError(undefined);
    }
    onOpenChange(nextOpen);
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    setSubmitError(undefined);
    let valid = true;

    if (name.trim() === "") {
      setNameError(CREATE_ANNUITY_DIALOG_COPY.nameRequiredError);
      valid = false;
    } else {
      setNameError(undefined);
    }

    let resolvedMonthlyAmount: number | undefined;
    let resolvedDuration: number | undefined;
    let resolvedPresentValue: number | undefined;
    let resolvedAnnualRate: number | undefined;

    if (mode === "flat") {
      const parsed = parseFloat(monthlyAmount);
      if (isNaN(parsed) || parsed <= 0) {
        setMonthlyAmountError(
          CREATE_ANNUITY_DIALOG_COPY.monthlyAmountInvalidError,
        );
        valid = false;
      } else {
        setMonthlyAmountError(undefined);
        resolvedMonthlyAmount = parsed;
      }
    } else {
      const pv = parseFloat(presentValue);
      if (isNaN(pv) || pv <= 0) {
        setPresentValueError(
          CREATE_ANNUITY_DIALOG_COPY.presentValueInvalidError,
        );
        valid = false;
      } else {
        setPresentValueError(undefined);
        resolvedPresentValue = pv;
      }

      const rate = parseFloat(annualRate);
      if (isNaN(rate) || rate <= 0) {
        setAnnualRateError(CREATE_ANNUITY_DIALOG_COPY.annualRateInvalidError);
        valid = false;
      } else {
        setAnnualRateError(undefined);
        resolvedAnnualRate = rate;
      }

      const dur = parseInt(durationMonths, 10);
      if (isNaN(dur) || dur <= 0 || !Number.isInteger(dur)) {
        setDurationMonthsError(CREATE_ANNUITY_DIALOG_COPY.durationInvalidError);
        valid = false;
      } else {
        setDurationMonthsError(undefined);
        resolvedDuration = dur;
      }

      if (valid) {
        resolvedMonthlyAmount = calculateMonthlyPayment({
          annualRatePercent: rate,
          durationMonths: dur,
          presentValue: pv,
        });
      }
    }

    if (!valid || resolvedMonthlyAmount === undefined) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        annualRatePercent: resolvedAnnualRate,
        durationMonths: resolvedDuration,
        monthlyAmount: resolvedMonthlyAmount,
        monthlyMode:
          mode === "pv"
            ? AnnuityMonthlyMode.PVDerived
            : AnnuityMonthlyMode.Flat,
        name: name.trim(),
        presentValue: resolvedPresentValue,
      });
      handleOpenChange(false);
    } catch {
      setSubmitError(CREATE_ANNUITY_DIALOG_COPY.submitError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <CreateAnnuityDialogView
      open={open}
      onOpenChange={handleOpenChange}
      mode={mode}
      onModeChange={setMode}
      name={name}
      onNameChange={setName}
      monthlyAmount={monthlyAmount}
      onMonthlyAmountChange={setMonthlyAmount}
      presentValue={presentValue}
      onPresentValueChange={setPresentValue}
      annualRate={annualRate}
      onAnnualRateChange={setAnnualRate}
      durationMonths={durationMonths}
      onDurationMonthsChange={setDurationMonths}
      monthlyPreview={monthlyPreview}
      nameError={nameError}
      monthlyAmountError={monthlyAmountError}
      presentValueError={presentValueError}
      annualRateError={annualRateError}
      durationMonthsError={durationMonthsError}
      submitError={submitError}
      onSubmit={() => void handleSubmit()}
      isSubmitting={isSubmitting}
    />
  );
}
