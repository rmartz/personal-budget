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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BudgetLedgerTransaction } from "@/lib/firebase/schema/budget-ledger-transactions";

import { ADD_DEPOSIT_DIALOG_COPY } from "./AddDepositDialog.copy";

type DepositInput = Omit<BudgetLedgerTransaction, "id" | "ledgerId" | "type">;

export interface AddDepositDialogViewProps {
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

export function AddDepositDialogView({
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
}: AddDepositDialogViewProps) {
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
          <DialogTitle>{ADD_DEPOSIT_DIALOG_COPY.title}</DialogTitle>
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
              <Label htmlFor={dateInputId}>
                {ADD_DEPOSIT_DIALOG_COPY.dateLabel}
              </Label>
              <Input
                id={dateInputId}
                type="date"
                value={date}
                onChange={(e) => {
                  onDateChange(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={amountInputId}>
                {ADD_DEPOSIT_DIALOG_COPY.amountLabel}
              </Label>
              <Input
                id={amountInputId}
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => {
                  onAmountChange(e.target.value);
                }}
                placeholder={ADD_DEPOSIT_DIALOG_COPY.amountPlaceholder}
                aria-invalid={amountError !== undefined}
                aria-describedby={amountError ? amountErrorId : undefined}
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
              <Label htmlFor={descriptionInputId}>
                {ADD_DEPOSIT_DIALOG_COPY.descriptionLabel}
              </Label>
              <Input
                id={descriptionInputId}
                type="text"
                value={description}
                onChange={(e) => {
                  onDescriptionChange(e.target.value);
                }}
                placeholder={ADD_DEPOSIT_DIALOG_COPY.descriptionPlaceholder}
                aria-invalid={descriptionError !== undefined}
                aria-describedby={
                  descriptionError ? descriptionErrorId : undefined
                }
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
              {ADD_DEPOSIT_DIALOG_COPY.cancelButton}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? ADD_DEPOSIT_DIALOG_COPY.submittingButton
                : ADD_DEPOSIT_DIALOG_COPY.submitButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export interface AddDepositDialogProps {
  open: boolean;
  onSubmit: (data: DepositInput) => Promise<void>;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
}

export function AddDepositDialog({
  open,
  onSubmit,
  onOpenChange,
  isSubmitting,
}: AddDepositDialogProps) {
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [amountError, setAmountError] = useState<string | undefined>(undefined);
  const [descriptionError, setDescriptionError] = useState<string | undefined>(
    undefined,
  );
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);

  const handleClose = () => {
    setDate(today);
    setAmount("");
    setDescription("");
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
      setAmountError(ADD_DEPOSIT_DIALOG_COPY.amountRequiredError);
      valid = false;
    } else if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError(ADD_DEPOSIT_DIALOG_COPY.amountInvalidError);
      valid = false;
    }

    if (description.trim().length === 0) {
      setDescriptionError(ADD_DEPOSIT_DIALOG_COPY.descriptionRequiredError);
      valid = false;
    }

    if (!valid) {
      return;
    }

    try {
      await onSubmit({
        date: new Date(date),
        amount: parsedAmount,
        description: description.trim(),
      });
      handleClose();
    } catch {
      setSubmitError(ADD_DEPOSIT_DIALOG_COPY.submitError);
    }
  };

  return (
    <AddDepositDialogView
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
