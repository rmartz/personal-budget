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

import { ADD_EXPENSE_DIALOG_COPY } from "./AddExpenseDialog.copy";

export interface AddExpenseInput {
  date: Date;
  amount: number;
  description: string;
}

export interface AddExpenseDialogProps {
  open: boolean;
  onSubmit: (data: AddExpenseInput) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

function todayIso(): string {
  return new Date().toISOString().split("T")[0] ?? "";
}

export function AddExpenseDialog({
  open,
  onSubmit,
  onClose,
  isSubmitting,
}: AddExpenseDialogProps) {
  const [date, setDate] = useState(todayIso);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [amountError, setAmountError] = useState<string | undefined>(undefined);
  const [descriptionError, setDescriptionError] = useState<string | undefined>(
    undefined,
  );
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);

  const baseId = useId();
  const dateInputId = `${baseId}-date`;
  const amountInputId = `${baseId}-amount`;
  const amountErrorId = `${baseId}-amount-error`;
  const descriptionInputId = `${baseId}-description`;
  const descriptionErrorId = `${baseId}-description-error`;

  const handleClose = () => {
    setDate(todayIso());
    setAmount("");
    setDescription("");
    setAmountError(undefined);
    setDescriptionError(undefined);
    setSubmitError(undefined);
    onClose();
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitError(undefined);

    let valid = true;

    if (amount.trim().length === 0) {
      setAmountError(ADD_EXPENSE_DIALOG_COPY.amountRequiredError);
      valid = false;
    } else {
      const parsed = parseFloat(amount);
      if (isNaN(parsed) || parsed <= 0) {
        setAmountError(ADD_EXPENSE_DIALOG_COPY.amountInvalidError);
        valid = false;
      }
    }

    if (description.trim().length === 0) {
      setDescriptionError(ADD_EXPENSE_DIALOG_COPY.descriptionRequiredError);
      valid = false;
    }

    if (!valid) {
      return;
    }

    try {
      await onSubmit({
        date: new Date(date + "T00:00:00"),
        amount: parseFloat(amount),
        description: description.trim(),
      });
      handleClose();
    } catch {
      setSubmitError(ADD_EXPENSE_DIALOG_COPY.submitError);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen: boolean) => {
        if (!isOpen && isSubmitting) return;
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ADD_EXPENSE_DIALOG_COPY.title}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          noValidate
        >
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={dateInputId}
                className="text-sm font-medium leading-none"
              >
                {ADD_EXPENSE_DIALOG_COPY.dateLabel}
              </label>
              <input
                id={dateInputId}
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
                className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={amountInputId}
                className="text-sm font-medium leading-none"
              >
                {ADD_EXPENSE_DIALOG_COPY.amountLabel}
              </label>
              <input
                id={amountInputId}
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setAmountError(undefined);
                }}
                placeholder={ADD_EXPENSE_DIALOG_COPY.amountPlaceholder}
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
                {ADD_EXPENSE_DIALOG_COPY.descriptionLabel}
              </label>
              <input
                id={descriptionInputId}
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setDescriptionError(undefined);
                }}
                placeholder={ADD_EXPENSE_DIALOG_COPY.descriptionPlaceholder}
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
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {ADD_EXPENSE_DIALOG_COPY.cancelButton}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? ADD_EXPENSE_DIALOG_COPY.submittingButton
                : ADD_EXPENSE_DIALOG_COPY.submitButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
