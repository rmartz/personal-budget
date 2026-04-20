"use client";

import { Dialog } from "@base-ui/react/dialog";
import type { InvestmentLedger } from "@/lib/types";
import { INVESTMENT_LEDGER_DELETE_DIALOG_COPY } from "./copy";

export interface InvestmentLedgerDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ledger: InvestmentLedger | undefined;
  onConfirm: () => void;
  isPending?: boolean;
}

export function InvestmentLedgerDeleteDialog({
  open,
  onOpenChange,
  ledger,
  onConfirm,
  isPending = false,
}: InvestmentLedgerDeleteDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40 transition-all data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-white p-6 shadow-xl outline-none transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 dark:bg-zinc-900">
          <Dialog.Title className="mb-2 text-lg font-semibold">
            {INVESTMENT_LEDGER_DELETE_DIALOG_COPY.title}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-zinc-600 dark:text-zinc-400">
            {ledger &&
              INVESTMENT_LEDGER_DELETE_DIALOG_COPY.description(ledger.name)}
          </Dialog.Description>
          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close
              className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              disabled={isPending}
            >
              {INVESTMENT_LEDGER_DELETE_DIALOG_COPY.cancel}
            </Dialog.Close>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {INVESTMENT_LEDGER_DELETE_DIALOG_COPY.confirm}
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
