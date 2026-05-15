"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Annuity } from "@/lib/firebase/schema/annuities";

import { DELETE_ANNUITY_DIALOG_COPY } from "./copy";

export interface DeleteAnnuityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  annuity: Annuity;
  onConfirm: () => void;
  isDeleting: boolean;
  deleteError?: string;
}

export function DeleteAnnuityDialog({
  open,
  onOpenChange,
  annuity,
  onConfirm,
  isDeleting,
  deleteError,
}: DeleteAnnuityDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen: boolean) => {
        if (!isOpen && isDeleting) return;
        onOpenChange(isOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{DELETE_ANNUITY_DIALOG_COPY.title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {DELETE_ANNUITY_DIALOG_COPY.confirmMessage(annuity.name)}
        </p>
        {deleteError !== undefined && (
          <p role="alert" className="text-xs text-destructive">
            {deleteError}
          </p>
        )}
        <DialogFooter className="mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
            disabled={isDeleting}
          >
            {DELETE_ANNUITY_DIALOG_COPY.cancelButton}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting
              ? DELETE_ANNUITY_DIALOG_COPY.deletingButton
              : DELETE_ANNUITY_DIALOG_COPY.confirmButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
