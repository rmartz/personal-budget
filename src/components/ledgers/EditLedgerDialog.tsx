"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import type { UpdateLedgerInput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EDIT_LEDGER_DIALOG_COPY } from "./copy";

export interface EditLedgerDialogProps {
  ledgerId: string;
  initialName: string;
  initialCashCap: number | undefined;
  onSave: (id: string, data: UpdateLedgerInput) => Promise<void>;
}

export function EditLedgerDialog({
  ledgerId,
  initialName,
  initialCashCap,
  onSave,
}: EditLedgerDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [cashCapRaw, setCashCapRaw] = useState(
    initialCashCap !== undefined ? String(initialCashCap) : "",
  );
  const [nameError, setNameError] = useState<string | undefined>();
  const [cashCapError, setCashCapError] = useState<string | undefined>();
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync form field values from props whenever the dialog is closed so the next
  // open always shows the current ledger values (e.g. after a successful save
  // causes React Query to update the parent's data).
  useEffect(() => {
    if (!open) {
      setName(initialName);
      setCashCapRaw(initialCashCap !== undefined ? String(initialCashCap) : "");
    }
  }, [initialName, initialCashCap, open]);

  const nameInputId = `edit-ledger-name-${ledgerId}`;
  const nameErrorId = `edit-ledger-name-error-${ledgerId}`;
  const cashCapInputId = `edit-ledger-cash-cap-${ledgerId}`;
  const cashCapErrorId = `edit-ledger-cash-cap-error-${ledgerId}`;

  const resetForm = () => {
    setName(initialName);
    setCashCapRaw(initialCashCap !== undefined ? String(initialCashCap) : "");
    setIsSubmitting(false);
    setNameError(undefined);
    setCashCapError(undefined);
    setSubmitError(undefined);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isSubmitting) return;
    if (!nextOpen) {
      resetForm();
    }
    setOpen(nextOpen);
  };

  const handleCancel = () => {
    handleOpenChange(false);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    let valid = true;

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError(EDIT_LEDGER_DIALOG_COPY.nameRequired);
      valid = false;
    } else {
      setNameError(undefined);
    }

    let cashCap: number | null = null;
    if (cashCapRaw.trim() !== "") {
      const parsed = Number(cashCapRaw);
      if (isNaN(parsed) || parsed <= 0) {
        setCashCapError(EDIT_LEDGER_DIALOG_COPY.cashCapInvalid);
        valid = false;
      } else {
        setCashCapError(undefined);
        cashCap = parsed;
      }
    } else {
      setCashCapError(undefined);
    }

    if (!valid) return;

    setIsSubmitting(true);
    setSubmitError(undefined);
    try {
      await onSave(ledgerId, { name: trimmedName, cashCap });
      // Close directly rather than via handleOpenChange(false) because the
      // guard there blocks close while isSubmitting is true, and isSubmitting
      // is still true here (the finally block resets it afterward).
      resetForm();
      setOpen(false);
    } catch {
      setSubmitError(EDIT_LEDGER_DIALOG_COPY.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`${EDIT_LEDGER_DIALOG_COPY.editButton} ${initialName}`}
          />
        }
      >
        <Pencil aria-hidden="true" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{EDIT_LEDGER_DIALOG_COPY.dialogTitle}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          noValidate
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor={nameInputId} className="text-sm font-medium">
              {EDIT_LEDGER_DIALOG_COPY.nameLabel}
            </label>
            <input
              id={nameInputId}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder={EDIT_LEDGER_DIALOG_COPY.namePlaceholder}
              aria-invalid={nameError !== undefined}
              aria-describedby={
                nameError !== undefined ? nameErrorId : undefined
              }
              className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring aria-invalid:border-destructive"
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
          <div className="flex flex-col gap-1">
            <label htmlFor={cashCapInputId} className="text-sm font-medium">
              {EDIT_LEDGER_DIALOG_COPY.cashCapLabel}
            </label>
            <input
              id={cashCapInputId}
              type="number"
              min="0.01"
              step="0.01"
              value={cashCapRaw}
              onChange={(e) => {
                setCashCapRaw(e.target.value);
              }}
              placeholder={EDIT_LEDGER_DIALOG_COPY.cashCapPlaceholder}
              aria-invalid={cashCapError !== undefined}
              aria-describedby={
                cashCapError !== undefined ? cashCapErrorId : undefined
              }
              className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring aria-invalid:border-destructive"
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
            <p role="alert" className="text-sm text-destructive">
              {submitError}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {EDIT_LEDGER_DIALOG_COPY.cancelButton}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {EDIT_LEDGER_DIALOG_COPY.saveButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
