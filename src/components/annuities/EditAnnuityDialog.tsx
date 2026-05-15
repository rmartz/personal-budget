"use client";

import { useState } from "react";

import type { Annuity } from "@/lib/firebase/schema/annuities";

import { EDIT_ANNUITY_DIALOG_COPY } from "./copy";
import { EditAnnuityDialogView } from "./EditAnnuityDialogView";

export type { EditAnnuityDialogViewProps } from "./EditAnnuityDialogView";
export { EditAnnuityDialogView } from "./EditAnnuityDialogView";

export interface EditAnnuityInput {
  name: string;
  monthlyAmount: number;
}

export interface EditAnnuityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  annuity: Annuity;
  onSave: (data: EditAnnuityInput) => Promise<void>;
}

export function EditAnnuityDialog({
  open,
  onOpenChange,
  annuity,
  onSave,
}: EditAnnuityDialogProps) {
  const [name, setName] = useState(annuity.name);
  const [monthlyAmount, setMonthlyAmount] = useState(
    String(annuity.monthlyAmount),
  );
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [monthlyAmountError, setMonthlyAmountError] = useState<
    string | undefined
  >(undefined);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && isSubmitting) return;
    if (!nextOpen) {
      setName(annuity.name);
      setMonthlyAmount(String(annuity.monthlyAmount));
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
      setNameError(EDIT_ANNUITY_DIALOG_COPY.nameRequiredError);
      valid = false;
    } else {
      setNameError(undefined);
    }

    const parsed = parseFloat(monthlyAmount);
    if (isNaN(parsed) || parsed <= 0) {
      setMonthlyAmountError(EDIT_ANNUITY_DIALOG_COPY.monthlyAmountInvalidError);
      valid = false;
    } else {
      setMonthlyAmountError(undefined);
    }

    if (!valid) return;

    setIsSubmitting(true);
    try {
      await onSave({ name: name.trim(), monthlyAmount: parsed });
      handleOpenChange(false);
    } catch {
      setSubmitError(EDIT_ANNUITY_DIALOG_COPY.submitError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <EditAnnuityDialogView
      open={open}
      onOpenChange={handleOpenChange}
      name={name}
      onNameChange={setName}
      monthlyAmount={monthlyAmount}
      onMonthlyAmountChange={setMonthlyAmount}
      nameError={nameError}
      monthlyAmountError={monthlyAmountError}
      submitError={submitError}
      onSubmit={() => void handleSubmit()}
      isSubmitting={isSubmitting}
    />
  );
}
