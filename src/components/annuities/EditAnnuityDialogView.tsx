"use client";

import { useId } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { EDIT_ANNUITY_DIALOG_COPY } from "./copy";

export interface EditAnnuityDialogViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (value: string) => void;
  monthlyAmount: string;
  onMonthlyAmountChange: (value: string) => void;
  nameError: string | undefined;
  monthlyAmountError: string | undefined;
  submitError: string | undefined;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function EditAnnuityDialogView({
  open,
  onOpenChange,
  name,
  onNameChange,
  monthlyAmount,
  onMonthlyAmountChange,
  nameError,
  monthlyAmountError,
  submitError,
  onSubmit,
  isSubmitting,
}: EditAnnuityDialogViewProps) {
  const baseId = useId();
  const nameInputId = `${baseId}-name`;
  const nameErrorId = `${baseId}-name-error`;
  const monthlyAmountInputId = `${baseId}-monthly-amount`;
  const monthlyAmountErrorId = `${baseId}-monthly-amount-error`;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen: boolean) => {
        if (!isOpen && isSubmitting) return;
        onOpenChange(isOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{EDIT_ANNUITY_DIALOG_COPY.title}</DialogTitle>
        </DialogHeader>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={nameInputId}
                className="text-sm font-medium leading-none"
              >
                {EDIT_ANNUITY_DIALOG_COPY.nameLabel}
              </label>
              <input
                id={nameInputId}
                type="text"
                value={name}
                onChange={(e) => {
                  onNameChange(e.target.value);
                }}
                placeholder={EDIT_ANNUITY_DIALOG_COPY.namePlaceholder}
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
                htmlFor={monthlyAmountInputId}
                className="text-sm font-medium leading-none"
              >
                {EDIT_ANNUITY_DIALOG_COPY.monthlyAmountLabel}
              </label>
              <input
                id={monthlyAmountInputId}
                type="number"
                min="0.01"
                step="0.01"
                value={monthlyAmount}
                onChange={(e) => {
                  onMonthlyAmountChange(e.target.value);
                }}
                placeholder={EDIT_ANNUITY_DIALOG_COPY.monthlyAmountPlaceholder}
                aria-invalid={monthlyAmountError !== undefined}
                aria-describedby={
                  monthlyAmountError ? monthlyAmountErrorId : undefined
                }
                className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              {monthlyAmountError !== undefined && (
                <p
                  id={monthlyAmountErrorId}
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {monthlyAmountError}
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
              onClick={() => {
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              {EDIT_ANNUITY_DIALOG_COPY.cancelButton}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? EDIT_ANNUITY_DIALOG_COPY.savingButton
                : EDIT_ANNUITY_DIALOG_COPY.submitButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
