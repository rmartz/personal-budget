"use client";

import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";

import { DELETE_EXPENSE_DIALOG_COPY } from "./DeleteExpenseDialog.copy";

export interface DeleteExpenseDialogViewProps {
  deleteError: string | undefined;
  expenseName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function DeleteExpenseDialogView({
  deleteError,
  expenseName,
  isDeleting,
  onConfirm,
  onOpenChange,
  open,
}: DeleteExpenseDialogViewProps) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <DialogTitle>{DELETE_EXPENSE_DIALOG_COPY.title}</DialogTitle>
          <p className="mt-3 text-sm text-muted-foreground">
            {DELETE_EXPENSE_DIALOG_COPY.message(expenseName)}
          </p>

          {deleteError !== undefined && (
            <p role="alert" className="mt-2 text-sm text-destructive">
              {deleteError}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => {
                onOpenChange(false);
              }}
            >
              {DELETE_EXPENSE_DIALOG_COPY.cancelButton}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={onConfirm}
            >
              {isDeleting
                ? DELETE_EXPENSE_DIALOG_COPY.deletingButton
                : DELETE_EXPENSE_DIALOG_COPY.confirmButton}
            </Button>
          </div>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  );
}

export { DeleteExpenseDialogView as DeleteExpenseDialog };
