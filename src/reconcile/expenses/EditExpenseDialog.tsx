"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ReconciliationExpense } from "@/lib/firebase/schema/reconciliation-expenses";
import { ReconciliationExpenseType } from "@/lib/firebase/schema/reconciliation-expenses";

import { EDIT_EXPENSE_DIALOG_COPY } from "./EditExpenseDialog.copy";

export interface EditExpenseInput {
  name: string;
  type: ReconciliationExpenseType;
  typicalAmount: number;
}

export interface EditExpenseDialogViewProps {
  isSubmitting: boolean;
  name: string;
  nameError: string | undefined;
  onNameChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  onTypeChange: (value: ReconciliationExpenseType) => void;
  onTypicalAmountChange: (value: string) => void;
  open: boolean;
  submitError: string | undefined;
  type: ReconciliationExpenseType;
  typicalAmount: string;
  typicalAmountError: string | undefined;
}

export function EditExpenseDialogView({
  isSubmitting,
  name,
  nameError,
  onNameChange,
  onOpenChange,
  onSubmit,
  onTypeChange,
  onTypicalAmountChange,
  open,
  submitError,
  type,
  typicalAmount,
  typicalAmountError,
}: EditExpenseDialogViewProps) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <DialogTitle>{EDIT_EXPENSE_DIALOG_COPY.title}</DialogTitle>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-expense-name">
                  {EDIT_EXPENSE_DIALOG_COPY.nameLabel}
                </Label>
                <Input
                  id="edit-expense-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    onNameChange(e.target.value);
                  }}
                  placeholder={EDIT_EXPENSE_DIALOG_COPY.namePlaceholder}
                  aria-invalid={nameError !== undefined}
                  aria-describedby={
                    nameError !== undefined
                      ? "edit-expense-name-error"
                      : undefined
                  }
                />
                {nameError !== undefined && (
                  <p
                    id="edit-expense-name-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {nameError}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">
                  {EDIT_EXPENSE_DIALOG_COPY.typeLabel}
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={
                      type === ReconciliationExpenseType.StatementBalance
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    aria-pressed={
                      type === ReconciliationExpenseType.StatementBalance
                    }
                    onClick={() => {
                      onTypeChange(ReconciliationExpenseType.StatementBalance);
                    }}
                  >
                    {EDIT_EXPENSE_DIALOG_COPY.typeStatementBalance}
                  </Button>
                  <Button
                    type="button"
                    variant={
                      type === ReconciliationExpenseType.RunningBalance
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    aria-pressed={
                      type === ReconciliationExpenseType.RunningBalance
                    }
                    onClick={() => {
                      onTypeChange(ReconciliationExpenseType.RunningBalance);
                    }}
                  >
                    {EDIT_EXPENSE_DIALOG_COPY.typeRunningBalance}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-expense-amount">
                  {EDIT_EXPENSE_DIALOG_COPY.amountLabel}
                </Label>
                <Input
                  id="edit-expense-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={typicalAmount}
                  onChange={(e) => {
                    onTypicalAmountChange(e.target.value);
                  }}
                  placeholder={EDIT_EXPENSE_DIALOG_COPY.amountPlaceholder}
                  aria-invalid={typicalAmountError !== undefined}
                  aria-describedby={
                    typicalAmountError !== undefined
                      ? "edit-expense-amount-error"
                      : undefined
                  }
                />
                {typicalAmountError !== undefined && (
                  <p
                    id="edit-expense-amount-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {typicalAmountError}
                  </p>
                )}
              </div>
            </div>

            {submitError !== undefined && (
              <p role="alert" className="mt-2 text-sm text-destructive">
                {submitError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => {
                  onOpenChange(false);
                }}
              >
                {EDIT_EXPENSE_DIALOG_COPY.cancelButton}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? EDIT_EXPENSE_DIALOG_COPY.savingButton
                  : EDIT_EXPENSE_DIALOG_COPY.submitButton}
              </Button>
            </div>
          </form>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  );
}

export interface EditExpenseDialogProps {
  expense: ReconciliationExpense | undefined;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, data: EditExpenseInput) => Promise<unknown>;
  open: boolean;
}

export function EditExpenseDialog({
  expense,
  onOpenChange,
  onSubmit,
  open,
}: EditExpenseDialogProps) {
  const [name, setName] = useState(expense?.name ?? "");
  const [type, setType] = useState<ReconciliationExpenseType>(
    expense?.type ?? ReconciliationExpenseType.StatementBalance,
  );
  const [typicalAmount, setTypicalAmount] = useState(
    expense?.typicalAmount !== undefined ? String(expense.typicalAmount) : "",
  );
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [typicalAmountError, setTypicalAmountError] = useState<
    string | undefined
  >(undefined);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && isSubmitting) return;
    if (!nextOpen) {
      setNameError(undefined);
      setTypicalAmountError(undefined);
      setSubmitError(undefined);
    }
    onOpenChange(nextOpen);
  }

  async function handleSubmit() {
    if (isSubmitting || expense === undefined) return;
    setSubmitError(undefined);
    let valid = true;
    let validatedName = "";

    if (name.trim() === "") {
      setNameError(EDIT_EXPENSE_DIALOG_COPY.nameRequiredError);
      valid = false;
    } else {
      setNameError(undefined);
      validatedName = name.trim();
    }

    const parsed = parseFloat(typicalAmount);
    if (isNaN(parsed) || parsed <= 0) {
      setTypicalAmountError(EDIT_EXPENSE_DIALOG_COPY.amountInvalidError);
      valid = false;
    } else {
      setTypicalAmountError(undefined);
    }

    if (!valid) return;

    setIsSubmitting(true);
    try {
      await onSubmit(expense.id, {
        name: validatedName,
        type,
        typicalAmount: parsed,
      });
      handleOpenChange(false);
    } catch {
      setSubmitError(EDIT_EXPENSE_DIALOG_COPY.submitError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <EditExpenseDialogView
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
