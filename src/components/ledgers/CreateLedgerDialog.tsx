"use client";

import { useState, useId } from "react";
import type { CreateLedgerInput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CREATE_LEDGER_DIALOG_COPY } from "./copy";

export interface CreateLedgerDialogProps {
  open: boolean;
  onSubmit: (data: CreateLedgerInput) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

export function CreateLedgerDialog({
  open,
  onSubmit,
  onClose,
  isSubmitting,
}: CreateLedgerDialogProps) {
  const [name, setName] = useState("");
  const [cashCap, setCashCap] = useState("");
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [cashCapError, setCashCapError] = useState<string | undefined>(
    undefined,
  );
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);

  const baseId = useId();
  const nameInputId = `${baseId}-name`;
  const nameErrorId = `${baseId}-name-error`;
  const cashCapInputId = `${baseId}-cash-cap`;
  const cashCapErrorId = `${baseId}-cash-cap-error`;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameError(undefined);
  };

  const handleCashCapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCashCap(e.target.value);
    setCashCapError(undefined);
  };

  const handleClose = () => {
    setName("");
    setCashCap("");
    setNameError(undefined);
    setCashCapError(undefined);
    setSubmitError(undefined);
    onClose();
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitError(undefined);

    let valid = true;

    if (name.trim().length === 0) {
      setNameError(CREATE_LEDGER_DIALOG_COPY.nameRequiredError);
      valid = false;
    }

    let parsedCashCap: number | undefined = undefined;
    if (cashCap.trim().length > 0) {
      const parsed = parseFloat(cashCap);
      if (isNaN(parsed) || parsed <= 0) {
        setCashCapError(CREATE_LEDGER_DIALOG_COPY.cashCapInvalidError);
        valid = false;
      } else {
        parsedCashCap = parsed;
      }
    }

    if (!valid) {
      return;
    }

    try {
      await onSubmit({ name: name.trim(), cashCap: parsedCashCap });
      handleClose();
    } catch {
      setSubmitError(CREATE_LEDGER_DIALOG_COPY.submitError);
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
          <DialogTitle>{CREATE_LEDGER_DIALOG_COPY.title}</DialogTitle>
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
                htmlFor={nameInputId}
                className="text-sm font-medium leading-none"
              >
                {CREATE_LEDGER_DIALOG_COPY.nameLabel}
              </label>
              <input
                id={nameInputId}
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder={CREATE_LEDGER_DIALOG_COPY.namePlaceholder}
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
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={cashCapInputId}
                className="text-sm font-medium leading-none"
              >
                {CREATE_LEDGER_DIALOG_COPY.cashCapLabel}
              </label>
              <input
                id={cashCapInputId}
                type="number"
                min="0.01"
                step="0.01"
                value={cashCap}
                onChange={handleCashCapChange}
                placeholder={CREATE_LEDGER_DIALOG_COPY.cashCapPlaceholder}
                aria-invalid={cashCapError !== undefined}
                aria-describedby={cashCapError ? cashCapErrorId : undefined}
                className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              {cashCapError !== undefined && (
                <p
                  id={cashCapErrorId}
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {cashCapError}
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
              {CREATE_LEDGER_DIALOG_COPY.cancelButton}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? CREATE_LEDGER_DIALOG_COPY.createButton
                : CREATE_LEDGER_DIALOG_COPY.submitButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
