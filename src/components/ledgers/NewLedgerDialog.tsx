"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { NEW_LEDGER_DIALOG_COPY } from "./copy";

export interface NewLedgerDialogViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (value: string) => void;
  cashCap: string;
  onCashCapChange: (value: string) => void;
  nameError: string | undefined;
  cashCapError: string | undefined;
  submitError: string | undefined;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function NewLedgerDialogView({
  open,
  onOpenChange,
  name,
  onNameChange,
  cashCap,
  onCashCapChange,
  nameError,
  cashCapError,
  submitError,
  onSubmit,
  isSubmitting,
}: NewLedgerDialogViewProps) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <DialogTitle>{NEW_LEDGER_DIALOG_COPY.title}</DialogTitle>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium"
                  htmlFor="new-ledger-name"
                >
                  {NEW_LEDGER_DIALOG_COPY.nameLabel}
                </label>
                <input
                  id="new-ledger-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    onNameChange(e.target.value);
                  }}
                  placeholder={NEW_LEDGER_DIALOG_COPY.namePlaceholder}
                  aria-invalid={nameError !== undefined}
                  aria-describedby={
                    nameError !== undefined
                      ? "new-ledger-name-error"
                      : undefined
                  }
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 aria-invalid:border-destructive"
                />
                {nameError !== undefined && (
                  <p
                    id="new-ledger-name-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {nameError}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium"
                  htmlFor="new-ledger-cash-cap"
                >
                  {NEW_LEDGER_DIALOG_COPY.cashCapLabel}
                </label>
                <input
                  id="new-ledger-cash-cap"
                  type="number"
                  min="0"
                  step="0.01"
                  value={cashCap}
                  onChange={(e) => {
                    onCashCapChange(e.target.value);
                  }}
                  placeholder={NEW_LEDGER_DIALOG_COPY.cashCapPlaceholder}
                  aria-invalid={cashCapError !== undefined}
                  aria-describedby={
                    cashCapError !== undefined
                      ? "new-ledger-cash-cap-error"
                      : undefined
                  }
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 aria-invalid:border-destructive"
                />
                {cashCapError !== undefined && (
                  <p
                    id="new-ledger-cash-cap-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {cashCapError}
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
              <DialogClose
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
                disabled={isSubmitting}
              >
                {NEW_LEDGER_DIALOG_COPY.cancelButton}
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {NEW_LEDGER_DIALOG_COPY.submitButton}
              </Button>
            </div>
          </form>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  );
}

export interface NewLedgerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, cashCap: number | undefined) => Promise<unknown>;
}

export function NewLedgerDialog({
  open,
  onOpenChange,
  onSubmit,
}: NewLedgerDialogProps) {
  const [name, setName] = useState("");
  const [cashCap, setCashCap] = useState("");
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [cashCapError, setCashCapError] = useState<string | undefined>(
    undefined,
  );
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && isSubmitting) return;
    if (!nextOpen) {
      setName("");
      setCashCap("");
      setNameError(undefined);
      setCashCapError(undefined);
      setSubmitError(undefined);
    }
    onOpenChange(nextOpen);
  }

  async function handleSubmit() {
    let valid = true;

    if (name.trim() === "") {
      setNameError(NEW_LEDGER_DIALOG_COPY.nameError);
      valid = false;
    } else {
      setNameError(undefined);
    }

    let parsedCashCap: number | undefined;
    if (cashCap.trim() !== "") {
      const parsed = parseFloat(cashCap);
      if (isNaN(parsed) || parsed <= 0) {
        setCashCapError(NEW_LEDGER_DIALOG_COPY.cashCapError);
        valid = false;
      } else {
        setCashCapError(undefined);
        parsedCashCap = parsed;
      }
    } else {
      setCashCapError(undefined);
    }

    if (!valid) return;

    setIsSubmitting(true);
    setSubmitError(undefined);
    try {
      await onSubmit(name.trim(), parsedCashCap);
      handleOpenChange(false);
    } catch {
      setSubmitError(NEW_LEDGER_DIALOG_COPY.submitError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <NewLedgerDialogView
      open={open}
      onOpenChange={handleOpenChange}
      name={name}
      onNameChange={setName}
      cashCap={cashCap}
      onCashCapChange={setCashCap}
      nameError={nameError}
      cashCapError={cashCapError}
      submitError={submitError}
      onSubmit={() => void handleSubmit()}
      isSubmitting={isSubmitting}
    />
  );
}
