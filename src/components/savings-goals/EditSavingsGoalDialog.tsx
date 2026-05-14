"use client";

import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

import { EDIT_SAVINGS_GOAL_DIALOG_COPY } from "./copy";

export interface EditSavingsGoalDialogProps {
  goal: BudgetLedgerSavingsGoal;
  onSave: (
    id: string,
    data: { name: string; targetAmount: number },
  ) => Promise<void>;
}

export function EditSavingsGoalDialog({
  goal,
  onSave,
}: EditSavingsGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(goal.name);
  const [targetAmountRaw, setTargetAmountRaw] = useState(
    String(goal.targetAmount),
  );
  const [nameError, setNameError] = useState<string | undefined>();
  const [targetAmountError, setTargetAmountError] = useState<
    string | undefined
  >();
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameInputId = `edit-goal-name-${goal.id}`;
  const nameErrorId = `edit-goal-name-error-${goal.id}`;
  const targetAmountInputId = `edit-goal-target-${goal.id}`;
  const targetAmountErrorId = `edit-goal-target-error-${goal.id}`;

  useEffect(() => {
    if (!open) {
      setName(goal.name);
      setTargetAmountRaw(String(goal.targetAmount));
    }
  }, [goal.name, goal.targetAmount, open]);

  const resetForm = () => {
    setName(goal.name);
    setTargetAmountRaw(String(goal.targetAmount));
    setIsSubmitting(false);
    setNameError(undefined);
    setTargetAmountError(undefined);
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
    if (isSubmitting) return;
    setSubmitError(undefined);

    let valid = true;

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError(EDIT_SAVINGS_GOAL_DIALOG_COPY.nameRequired);
      valid = false;
    } else {
      setNameError(undefined);
    }

    const parsedTarget = Number(targetAmountRaw);
    if (
      targetAmountRaw.trim() === "" ||
      isNaN(parsedTarget) ||
      parsedTarget <= 0
    ) {
      setTargetAmountError(EDIT_SAVINGS_GOAL_DIALOG_COPY.targetAmountInvalid);
      valid = false;
    } else {
      setTargetAmountError(undefined);
    }

    if (!valid) return;

    setIsSubmitting(true);
    try {
      await onSave(goal.id, { name: trimmedName, targetAmount: parsedTarget });
      resetForm();
      setOpen(false);
    } catch {
      setSubmitError(EDIT_SAVINGS_GOAL_DIALOG_COPY.submitError);
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
            aria-label={`${EDIT_SAVINGS_GOAL_DIALOG_COPY.editButton} ${goal.name}`}
          />
        }
      >
        <Pencil aria-hidden="true" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{EDIT_SAVINGS_GOAL_DIALOG_COPY.dialogTitle}</DialogTitle>
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
              {EDIT_SAVINGS_GOAL_DIALOG_COPY.nameLabel}
            </label>
            <input
              id={nameInputId}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder={EDIT_SAVINGS_GOAL_DIALOG_COPY.namePlaceholder}
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
            <label
              htmlFor={targetAmountInputId}
              className="text-sm font-medium"
            >
              {EDIT_SAVINGS_GOAL_DIALOG_COPY.targetAmountLabel}
            </label>
            <input
              id={targetAmountInputId}
              type="number"
              min="0.01"
              step="0.01"
              value={targetAmountRaw}
              onChange={(e) => {
                setTargetAmountRaw(e.target.value);
              }}
              placeholder={
                EDIT_SAVINGS_GOAL_DIALOG_COPY.targetAmountPlaceholder
              }
              aria-invalid={targetAmountError !== undefined}
              aria-describedby={
                targetAmountError !== undefined
                  ? targetAmountErrorId
                  : undefined
              }
              className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring aria-invalid:border-destructive"
            />
            {targetAmountError !== undefined && (
              <p
                id={targetAmountErrorId}
                role="alert"
                className="text-xs text-destructive"
              >
                {targetAmountError}
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
              {EDIT_SAVINGS_GOAL_DIALOG_COPY.cancelButton}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {EDIT_SAVINGS_GOAL_DIALOG_COPY.saveButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
