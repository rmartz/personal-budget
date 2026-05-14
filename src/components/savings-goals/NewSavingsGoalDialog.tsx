"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { NEW_SAVINGS_GOAL_DIALOG_COPY } from "./NewSavingsGoalDialog.copy";

export interface NewSavingsGoalDialogViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (value: string) => void;
  targetAmount: string;
  onTargetAmountChange: (value: string) => void;
  nameError: string | undefined;
  targetAmountError: string | undefined;
  submitError: string | undefined;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function NewSavingsGoalDialogView({
  open,
  onOpenChange,
  name,
  onNameChange,
  targetAmount,
  onTargetAmountChange,
  nameError,
  targetAmountError,
  submitError,
  onSubmit,
  isSubmitting,
}: NewSavingsGoalDialogViewProps) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <DialogTitle>{NEW_SAVINGS_GOAL_DIALOG_COPY.title}</DialogTitle>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-savings-goal-name">
                  {NEW_SAVINGS_GOAL_DIALOG_COPY.nameLabel}
                </Label>
                <Input
                  id="new-savings-goal-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    onNameChange(e.target.value);
                  }}
                  placeholder={NEW_SAVINGS_GOAL_DIALOG_COPY.namePlaceholder}
                  aria-invalid={nameError !== undefined}
                  aria-describedby={
                    nameError !== undefined
                      ? "new-savings-goal-name-error"
                      : undefined
                  }
                />
                {nameError !== undefined && (
                  <p
                    id="new-savings-goal-name-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {nameError}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-savings-goal-target-amount">
                  {NEW_SAVINGS_GOAL_DIALOG_COPY.targetAmountLabel}
                </Label>
                <Input
                  id="new-savings-goal-target-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={targetAmount}
                  onChange={(e) => {
                    onTargetAmountChange(e.target.value);
                  }}
                  placeholder={
                    NEW_SAVINGS_GOAL_DIALOG_COPY.targetAmountPlaceholder
                  }
                  aria-invalid={targetAmountError !== undefined}
                  aria-describedby={
                    targetAmountError !== undefined
                      ? "new-savings-goal-target-amount-error"
                      : undefined
                  }
                />
                {targetAmountError !== undefined && (
                  <p
                    id="new-savings-goal-target-amount-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {targetAmountError}
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
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => {
                  onOpenChange(false);
                }}
              >
                {NEW_SAVINGS_GOAL_DIALOG_COPY.cancelButton}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {NEW_SAVINGS_GOAL_DIALOG_COPY.submitButton}
              </Button>
            </div>
          </form>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  );
}

export interface NewSavingsGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, targetAmount: number) => Promise<unknown>;
}

export function NewSavingsGoalDialog({
  open,
  onOpenChange,
  onSubmit,
}: NewSavingsGoalDialogProps) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [targetAmountError, setTargetAmountError] = useState<
    string | undefined
  >(undefined);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && isSubmitting) return;
    if (!nextOpen) {
      setName("");
      setTargetAmount("");
      setNameError(undefined);
      setTargetAmountError(undefined);
      setSubmitError(undefined);
    }
    onOpenChange(nextOpen);
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    setSubmitError(undefined);
    let valid = true;

    if (name.trim() === "") {
      setNameError(NEW_SAVINGS_GOAL_DIALOG_COPY.nameError);
      valid = false;
    } else {
      setNameError(undefined);
    }

    const parsed = parseFloat(targetAmount);
    if (targetAmount.trim() === "" || isNaN(parsed) || parsed <= 0) {
      setTargetAmountError(NEW_SAVINGS_GOAL_DIALOG_COPY.targetAmountError);
      valid = false;
    } else {
      setTargetAmountError(undefined);
    }

    if (!valid) return;

    setIsSubmitting(true);
    try {
      await onSubmit(name.trim(), parsed);
      handleOpenChange(false);
    } catch {
      setSubmitError(NEW_SAVINGS_GOAL_DIALOG_COPY.submitError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <NewSavingsGoalDialogView
      open={open}
      onOpenChange={handleOpenChange}
      name={name}
      onNameChange={setName}
      targetAmount={targetAmount}
      onTargetAmountChange={setTargetAmount}
      nameError={nameError}
      targetAmountError={targetAmountError}
      submitError={submitError}
      onSubmit={() => void handleSubmit()}
      isSubmitting={isSubmitting}
    />
  );
}
