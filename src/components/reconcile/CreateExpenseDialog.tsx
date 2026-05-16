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
import { ReconciliationExpenseType } from "@/lib/firebase/schema/reconciliation-expenses";

import { CREATE_EXPENSE_DIALOG_COPY } from "./CreateExpenseDialog.copy";

export interface CreateExpenseInput {
  name: string;
  type: ReconciliationExpenseType;
  typicalAmount: number;
}

export interface CreateExpenseDialogViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (value: string) => void;
  type: ReconciliationExpenseType;
  onTypeChange: (value: ReconciliationExpenseType) => void;
  typicalAmount: string;
  onTypicalAmountChange: (value: string) => void;
  nameError: string | undefined;
  typicalAmountError: string | undefined;
  submitError: string | undefined;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function CreateExpenseDialogView({
  open,
  onOpenChange,
  name,
  onNameChange,
  type,
  onTypeChange,
  typicalAmount,
  onTypicalAmountChange,
  nameError,
  typicalAmountError,
  submitError,
  onSubmit,
  isSubmitting,
}: CreateExpenseDialogViewProps) {
  const baseId = useId();
  const nameInputId = `${baseId}-name`;
  const nameErrorId = `${baseId}-name-error`;
  const amountInputId = `${baseId}-amount`;
  const amountErrorId = `${baseId}-amount-error`;

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
          <DialogTitle>{CREATE_EXPENSE_DIALOG_COPY.title}</DialogTitle>
        </DialogHeader>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="flex flex-col gap-4 py-2">
            {/* Name field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={nameInputId}
                className="text-sm font-medium leading-none"
              >
                {CREATE_EXPENSE_DIALOG_COPY.nameLabel}
              </label>
              <input
                id={nameInputId}
                type="text"
                value={name}
                onChange={(e) => {
                  onNameChange(e.target.value);
                }}
                placeholder={CREATE_EXPENSE_DIALOG_COPY.namePlaceholder}
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

            {/* Type toggle */}
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium leading-none">
                {CREATE_EXPENSE_DIALOG_COPY.typeLabel}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-pressed={
                    type === ReconciliationExpenseType.StatementBalance
                  }
                  onClick={() => {
                    onTypeChange(ReconciliationExpenseType.StatementBalance);
                  }}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    type === ReconciliationExpenseType.StatementBalance
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  {CREATE_EXPENSE_DIALOG_COPY.typeStatementBalance}
                </button>
                <button
                  type="button"
                  aria-pressed={
                    type === ReconciliationExpenseType.RunningBalance
                  }
                  onClick={() => {
                    onTypeChange(ReconciliationExpenseType.RunningBalance);
                  }}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    type === ReconciliationExpenseType.RunningBalance
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  {CREATE_EXPENSE_DIALOG_COPY.typeRunningBalance}
                </button>
              </div>
            </div>

            {/* Monthly amount field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={amountInputId}
                className="text-sm font-medium leading-none"
              >
                {CREATE_EXPENSE_DIALOG_COPY.amountLabel}
              </label>
              <input
                id={amountInputId}
                type="number"
                min="0.01"
                step="0.01"
                value={typicalAmount}
                onChange={(e) => {
                  onTypicalAmountChange(e.target.value);
                }}
                placeholder={CREATE_EXPENSE_DIALOG_COPY.amountPlaceholder}
                aria-invalid={typicalAmountError !== undefined}
                aria-describedby={
                  typicalAmountError ? amountErrorId : undefined
                }
                className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              {typicalAmountError !== undefined && (
                <p
                  id={amountErrorId}
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {typicalAmountError}
                </p>
              )}
            </div>

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
              {CREATE_EXPENSE_DIALOG_COPY.cancelButton}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? CREATE_EXPENSE_DIALOG_COPY.creatingButton
                : CREATE_EXPENSE_DIALOG_COPY.submitButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
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

    const parsed = parseFloat(typicalAmount);
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
