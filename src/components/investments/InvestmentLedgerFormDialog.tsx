"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import type { InvestmentLedger } from "@/lib/types";
import { INVESTMENT_LEDGER_FORM_DIALOG_COPY } from "./copy";

export interface InvestmentLedgerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ledger?: InvestmentLedger;
  onSubmit: (data: { name: string }) => void;
  isPending?: boolean;
}

export function InvestmentLedgerFormDialog({
  open,
  onOpenChange,
  ledger,
  onSubmit,
  isPending = false,
}: InvestmentLedgerFormDialogProps) {
  const isEditMode = ledger !== undefined;
  const [name, setName] = useState(ledger?.name ?? "");
  const [nameError, setNameError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(ledger?.name ?? "");
      setNameError("");
    }
  }, [open, ledger]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError(INVESTMENT_LEDGER_FORM_DIALOG_COPY.nameRequiredError);
      inputRef.current?.focus();
      return;
    }
    onSubmit({ name: trimmed });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (nameError) setNameError("");
  };

  const title = isEditMode
    ? INVESTMENT_LEDGER_FORM_DIALOG_COPY.editTitle
    : INVESTMENT_LEDGER_FORM_DIALOG_COPY.createTitle;

  const submitLabel = isEditMode
    ? INVESTMENT_LEDGER_FORM_DIALOG_COPY.submitEdit
    : INVESTMENT_LEDGER_FORM_DIALOG_COPY.submitCreate;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40 transition-all data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-white p-6 shadow-xl outline-none transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 dark:bg-zinc-900">
          <Dialog.Title className="mb-4 text-lg font-semibold">
            {title}
          </Dialog.Title>
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="ledger-name"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {INVESTMENT_LEDGER_FORM_DIALOG_COPY.nameLabel}
              </label>
              <input
                ref={inputRef}
                id="ledger-name"
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder={INVESTMENT_LEDGER_FORM_DIALOG_COPY.namePlaceholder}
                aria-invalid={nameError ? true : undefined}
                aria-describedby={nameError ? "ledger-name-error" : undefined}
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20 aria-invalid:border-red-500 aria-invalid:ring-red-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-white dark:focus:ring-white/20"
              />
              {nameError && (
                <p
                  id="ledger-name-error"
                  role="alert"
                  className="text-sm text-red-600 dark:text-red-400"
                >
                  {nameError}
                </p>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close
                className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                disabled={isPending}
              >
                {INVESTMENT_LEDGER_FORM_DIALOG_COPY.cancel}
              </Dialog.Close>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {submitLabel}
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
