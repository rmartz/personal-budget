"use client";

import { useState } from "react";

import { ReconciliationExpenseType } from "@/lib/firebase/schema/reconciliation-expenses";

import { CREATE_EXPENSE_DIALOG_COPY } from "./CreateExpenseDialog.copy";
import { CreateExpenseDialogView } from "./CreateExpenseDialogView";

export interface CreateExpenseInput {
  name: string;
  type: ReconciliationExpenseType;
  typicalAmount: number;
}

export interface CreateExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateExpenseInput) => Promise<void>;
}

export function CreateExpenseDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateExpenseDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ReconciliationExpenseType>(
    ReconciliationExpenseType.StatementBalance,
  );
  const [typicalAmount, setTypicalAmount] = useState("");

  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [typicalAmountError, setTypicalAmountError] = useState<
    string | undefined
  >(undefined);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && isSubmitting) return;
    if (!nextOpen) {
      setName("");
      setType(ReconciliationExpenseType.StatementBalance);
      setTypicalAmount("");
      setNameError(undefined);
      setTypicalAmountError(undefined);
      setSubmitError(undefined);
    }
    onOpenChange(nextOpen);
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    setSubmitError(undefined);
    let valid = true;

    if (name.trim() === "") {
      setNameError(CREATE_EXPENSE_DIALOG_COPY.nameRequiredError);
      valid = false;
    } else {
      setNameError(undefined);
    }

    const parsed = Number(typicalAmount);
    if (isNaN(parsed) || parsed <= 0 || !isFinite(parsed)) {
      setTypicalAmountError(CREATE_EXPENSE_DIALOG_COPY.amountInvalidError);
      valid = false;
    } else {
      setTypicalAmountError(undefined);
    }

    if (!valid) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), type, typicalAmount: parsed });
      handleOpenChange(false);
    } catch {
      setSubmitError(CREATE_EXPENSE_DIALOG_COPY.submitError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <CreateExpenseDialogView
      open={open}
      onOpenChange={handleOpenChange}
      name={name}
      onNameChange={setName}
      type={type}
      onTypeChange={setType}
      typicalAmount={typicalAmount}
      onTypicalAmountChange={setTypicalAmount}
      nameError={nameError}
      typicalAmountError={typicalAmountError}
      submitError={submitError}
      onSubmit={() => void handleSubmit()}
      isSubmitting={isSubmitting}
    />
  );
}
