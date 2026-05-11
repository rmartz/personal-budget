"use client";

import { useState, useId } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BudgetLedgerTransaction } from "@/lib/firebase/schema/budget-ledger-transactions";
import { EDIT_TRANSACTION_DIALOG_COPY } from "./EditTransactionDialog.copy";

export type EditTransactionInput = Pick<
  BudgetLedgerTransaction,
  "date" | "amount" | "description"
>;

export interface EditTransactionDialogViewProps {
  open: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  date: string;
  onDateChange: (value: string) => void;
  amount: string;
  onAmountChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  amountError: string | undefined;
  descriptionError: string | undefined;
  submitError: string | undefined;
  onSubmit: () => void;
}

export function EditTransactionDialogView({
  open,
  onClose,
  isSubmitting,
  date,
  onDateChange,
  amount,
  onAmountChange,
  description,
  onDescriptionChange,
  amountError,
  descriptionError,
  submitError,
  onSubmit,
}: EditTransactionDialogViewProps) {
  const baseId = useId();
  const dateInputId = `${baseId}-date`;
  const amountInputId = `${baseId}-amount`;
  const amountErrorId = `${baseId}-amount-error`;
  const descriptionInputId = `${baseId}-description`;
  const descriptionErrorId = `${baseId}-description-error`;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen: boolean) => {
        if (!isOpen && isSubmitting) return;
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{EDIT_TRANSACTION_DIALOG_COPY.title}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          noValidate
        >
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={dateInputId}
                className="text-sm font-medium leading-none"
              >
                {EDIT_TRANSACTION_DIALOG_COPY.dateLabel}
              </label>
              <input
                id={dateInputId}
                type="date"
                value={date}
                onChange={(e) => {
                  onDateChange(e.target.value);
                }}
                className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={amountInputId}
                className="text-sm font-medium leading-none"
              >
                {EDIT_TRANSACTION_DIALOG_COPY.amountLabel}
              </label>
              <input
                id={amountInputId}
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => {
                  onAmountChange(e.target.value);
                }}
                placeholder={EDIT_TRANSACTION_DIALOG_COPY.amountPlaceholder}
                aria-invalid={amountError !== undefined}
                aria-describedby={amountError ? amountErrorId : undefined}
                className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              {amountError !== undefined && (
                <p
                  id={amountErrorId}
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {amountError}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={descriptionInputId}
                className="text-sm font-medium leading-none"
              >
                {EDIT_TRANSACTION_DIALOG_COPY.descriptionLabel}
              </label>
              <input
                id={descriptionInputId}
                type="text"
                value={description}
                onChange={(e) => {
                  onDescriptionChange(e.target.value);
                }}
                placeholder={
                  EDIT_TRANSACTION_DIALOG_COPY.descriptionPlaceholder
                }
                aria-invalid={descriptionError !== undefined}
                aria-describedby={
                  descriptionError ? descriptionErrorId : undefined
                }
                className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              {descriptionError !== undefined && (
                <p
                  id={descriptionErrorId}
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {descriptionError}
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
              onClick={onClose}
              disabled={isSubmitting}
            >
              {EDIT_TRANSACTION_DIALOG_COPY.cancelButton}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? EDIT_TRANSACTION_DIALOG_COPY.submittingButton
                : EDIT_TRANSACTION_DIALOG_COPY.submitButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export interface EditTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EditTransactionInput) => Promise<void>;
  isSubmitting: boolean;
  initialDate: Date;
  initialAmount: number;
  initialDescription: string;
}

function toDateInputValue(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function EditTransactionDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  initialDate,
  initialAmount,
  initialDescription,
}: EditTransactionDialogProps) {
  const [date, setDate] = useState(() => toDateInputValue(initialDate));
  const [amount, setAmount] = useState(() => String(initialAmount));
  const [description, setDescription] = useState(initialDescription);
  const [amountError, setAmountError] = useState<string | undefined>(undefined);
  const [descriptionError, setDescriptionError] = useState<string | undefined>(
    undefined,
  );
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);

  const handleClose = () => {
    setDate(toDateInputValue(initialDate));
    setAmount(String(initialAmount));
    setDescription(initialDescription);
    setAmountError(undefined);
    setDescriptionError(undefined);
    setSubmitError(undefined);
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setSubmitError(undefined);

    let valid = true;

    const parsedAmount = parseFloat(amount);
    if (amount.trim().length === 0) {
      setAmountError(EDIT_TRANSACTION_DIALOG_COPY.amountRequiredError);
      valid = false;
    } else if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError(EDIT_TRANSACTION_DIALOG_COPY.amountInvalidError);
      valid = false;
    }

    if (description.trim().length === 0) {
      setDescriptionError(
        EDIT_TRANSACTION_DIALOG_COPY.descriptionRequiredError,
      );
      valid = false;
    }

    if (!valid) {
      return;
    }

    try {
      await onSubmit({
        date: new Date(date + "T00:00:00"),
        amount: parsedAmount,
        description: description.trim(),
      });
      handleClose();
    } catch {
      setSubmitError(EDIT_TRANSACTION_DIALOG_COPY.submitError);
    }
  };

  return (
    <EditTransactionDialogView
      open={open}
      onClose={handleClose}
      isSubmitting={isSubmitting}
      date={date}
      onDateChange={setDate}
      amount={amount}
      onAmountChange={(value) => {
        setAmount(value);
        setAmountError(undefined);
      }}
      description={description}
      onDescriptionChange={(value) => {
        setDescription(value);
        setDescriptionError(undefined);
      }}
      amountError={amountError}
      descriptionError={descriptionError}
      submitError={submitError}
      onSubmit={() => void handleSubmit()}
    />
  );
}
