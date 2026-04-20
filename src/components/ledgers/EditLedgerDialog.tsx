"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Pencil } from "lucide-react";
import type { UpdateLedgerInput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { EDIT_LEDGER_DIALOG_COPY } from "./copy";

export interface EditLedgerDialogProps {
  ledgerId: string;
  initialName: string;
  initialCashCap: number | undefined;
  onSave: (id: string, data: UpdateLedgerInput) => void;
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

  const handleOpen = () => {
    setName(initialName);
    setCashCapRaw(initialCashCap !== undefined ? String(initialCashCap) : "");
    setNameError(undefined);
    setCashCapError(undefined);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    let valid = true;

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError(EDIT_LEDGER_DIALOG_COPY.nameRequired);
      valid = false;
    } else {
      setNameError(undefined);
    }

    let cashCap: number | undefined;
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
      cashCap = undefined;
    }

    if (!valid) return;

    onSave(ledgerId, { name: trimmedName, cashCap });
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={EDIT_LEDGER_DIALOG_COPY.editButton}
            onClick={handleOpen}
          />
        }
      >
        <Pencil aria-hidden="true" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40 dark:bg-black/60" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background p-6 shadow-lg">
          <Dialog.Title className="mb-4 text-lg font-semibold">
            {EDIT_LEDGER_DIALOG_COPY.dialogTitle}
          </Dialog.Title>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="edit-ledger-name" className="text-sm font-medium">
                {EDIT_LEDGER_DIALOG_COPY.nameLabel}
              </label>
              <input
                id="edit-ledger-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder={EDIT_LEDGER_DIALOG_COPY.namePlaceholder}
                aria-invalid={nameError !== undefined}
                className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring aria-invalid:border-destructive"
              />
              {nameError !== undefined && (
                <p className="text-xs text-destructive">{nameError}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="edit-ledger-cash-cap"
                className="text-sm font-medium"
              >
                {EDIT_LEDGER_DIALOG_COPY.cashCapLabel}
              </label>
              <input
                id="edit-ledger-cash-cap"
                type="number"
                min="0"
                step="any"
                value={cashCapRaw}
                onChange={(e) => {
                  setCashCapRaw(e.target.value);
                }}
                placeholder={EDIT_LEDGER_DIALOG_COPY.cashCapPlaceholder}
                aria-invalid={cashCapError !== undefined}
                className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring aria-invalid:border-destructive"
              />
              {cashCapError !== undefined && (
                <p className="text-xs text-destructive">{cashCapError}</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                {EDIT_LEDGER_DIALOG_COPY.cancelButton}
              </Button>
              <Button type="submit">
                {EDIT_LEDGER_DIALOG_COPY.saveButton}
              </Button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
