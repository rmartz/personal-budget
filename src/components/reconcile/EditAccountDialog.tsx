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
import {
  type ReconciliationAccount,
  ReconciliationAccountTier,
} from "@/lib/firebase/schema/reconciliation-accounts";
import { CASH_TIERS } from "@/lib/reconciliation/cash-tiers";

import { EDIT_ACCOUNT_DIALOG_COPY } from "./EditAccountDialog.copy";

function isCashTier(tier: ReconciliationAccountTier): boolean {
  return CASH_TIERS.has(tier);
}

export interface EditAccountInput {
  name: string;
  targetFloat: number | undefined;
}

export interface EditAccountDialogViewProps {
  isSubmitting: boolean;
  name: string;
  nameError: string | undefined;
  onNameChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  onTargetFloatChange: (value: string) => void;
  open: boolean;
  submitError: string | undefined;
  targetFloat: string;
  targetFloatError: string | undefined;
  tier: ReconciliationAccountTier;
}

export function EditAccountDialogView({
  isSubmitting,
  name,
  nameError,
  onNameChange,
  onOpenChange,
  onSubmit,
  onTargetFloatChange,
  open,
  submitError,
  targetFloat,
  targetFloatError,
  tier,
}: EditAccountDialogViewProps) {
  const showTargetFloat = isCashTier(tier);

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <DialogTitle>{EDIT_ACCOUNT_DIALOG_COPY.title}</DialogTitle>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-account-name">
                  {EDIT_ACCOUNT_DIALOG_COPY.nameLabel}
                </Label>
                <Input
                  id="edit-account-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    onNameChange(e.target.value);
                  }}
                  placeholder={EDIT_ACCOUNT_DIALOG_COPY.namePlaceholder}
                  aria-invalid={nameError !== undefined}
                  aria-describedby={
                    nameError !== undefined
                      ? "edit-account-name-error"
                      : undefined
                  }
                />
                {nameError !== undefined && (
                  <p
                    id="edit-account-name-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {nameError}
                  </p>
                )}
              </div>

              {showTargetFloat && (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-account-target-float">
                    {EDIT_ACCOUNT_DIALOG_COPY.targetFloatLabel}
                  </Label>
                  <Input
                    id="edit-account-target-float"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={targetFloat}
                    onChange={(e) => {
                      onTargetFloatChange(e.target.value);
                    }}
                    placeholder={
                      EDIT_ACCOUNT_DIALOG_COPY.targetFloatPlaceholder
                    }
                    aria-invalid={targetFloatError !== undefined}
                    aria-describedby={
                      targetFloatError !== undefined
                        ? "edit-account-target-float-error"
                        : undefined
                    }
                  />
                  {targetFloatError !== undefined && (
                    <p
                      id="edit-account-target-float-error"
                      role="alert"
                      className="text-sm text-destructive"
                    >
                      {targetFloatError}
                    </p>
                  )}
                </div>
              )}
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
                {EDIT_ACCOUNT_DIALOG_COPY.cancelButton}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? EDIT_ACCOUNT_DIALOG_COPY.savingButton
                  : EDIT_ACCOUNT_DIALOG_COPY.submitButton}
              </Button>
            </div>
          </form>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  );
}

export interface EditAccountDialogProps {
  account: ReconciliationAccount | undefined;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, data: EditAccountInput) => Promise<unknown>;
  open: boolean;
}

export function EditAccountDialog({
  account,
  onOpenChange,
  onSubmit,
  open,
}: EditAccountDialogProps) {
  const [name, setName] = useState(account?.name ?? "");
  const [targetFloat, setTargetFloat] = useState(
    account?.targetFloat !== undefined ? String(account.targetFloat) : "",
  );
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [targetFloatError, setTargetFloatError] = useState<string | undefined>(
    undefined,
  );
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && isSubmitting) return;
    if (!nextOpen) {
      setNameError(undefined);
      setTargetFloatError(undefined);
      setSubmitError(undefined);
    }
    onOpenChange(nextOpen);
  }

  async function handleSubmit() {
    if (isSubmitting || account === undefined) return;
    setSubmitError(undefined);
    let valid = true;
    let validatedName = "";
    let parsedTargetFloat: number | undefined;

    if (name.trim() === "") {
      setNameError(EDIT_ACCOUNT_DIALOG_COPY.nameRequiredError);
      valid = false;
    } else {
      setNameError(undefined);
      validatedName = name.trim();
    }

    if (isCashTier(account.tier)) {
      if (targetFloat.trim() === "") {
        setTargetFloatError(EDIT_ACCOUNT_DIALOG_COPY.targetFloatRequiredError);
        valid = false;
      } else {
        const parsed = parseFloat(targetFloat);
        if (isNaN(parsed) || parsed <= 0) {
          setTargetFloatError(EDIT_ACCOUNT_DIALOG_COPY.targetFloatInvalidError);
          valid = false;
        } else {
          setTargetFloatError(undefined);
          parsedTargetFloat = parsed;
        }
      }
    }

    if (!valid) return;

    setIsSubmitting(true);
    try {
      await onSubmit(account.id, {
        name: validatedName,
        targetFloat: parsedTargetFloat,
      });
      handleOpenChange(false);
    } catch {
      setSubmitError(EDIT_ACCOUNT_DIALOG_COPY.submitError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <EditAccountDialogView
      open={open}
      onOpenChange={handleOpenChange}
      name={name}
      onNameChange={setName}
      targetFloat={targetFloat}
      onTargetFloatChange={setTargetFloat}
      tier={account?.tier ?? ReconciliationAccountTier.ShortTerm}
      nameError={nameError}
      targetFloatError={targetFloatError}
      submitError={submitError}
      onSubmit={() => void handleSubmit()}
      isSubmitting={isSubmitting}
    />
  );
}
