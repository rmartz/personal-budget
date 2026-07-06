"use client";

import { useState } from "react";

import { calculateMonthlyPayment } from "@/lib/annuity-math";
import { AnnuityMonthlyMode } from "@/lib/firebase/schema/annuities";

import { CREATE_ANNUITY_DIALOG_COPY } from "./copy";
import { CreateAnnuityDialogView } from "./CreateAnnuityDialogView";
import { AnnuityMode } from "./types";

export interface CreateAnnuityInput {
  annualRatePercent: number | undefined;
  durationMonths: number | undefined;
  monthlyAmount: number;
  monthlyMode: AnnuityMonthlyMode;
  name: string;
  presentValue: number | undefined;
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
  const [mode, setMode] = useState(AnnuityMode.Flat);
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
    mode === AnnuityMode.PV &&
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
      setMode(AnnuityMode.Flat);
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

    if (mode === AnnuityMode.Flat) {
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
          mode === AnnuityMode.PV
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
