"use client";

import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";

import { CREATE_ACCOUNT_DIALOG_COPY } from "./copy";

const CASH_TIERS = new Set<ReconciliationAccountTier>([
  ReconciliationAccountTier.LongTerm,
  ReconciliationAccountTier.Reserve,
  ReconciliationAccountTier.ShortTerm,
]);

export function isCashTier(tier: ReconciliationAccountTier): boolean {
  return CASH_TIERS.has(tier);
}

export interface CreateAccountDialogViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (value: string) => void;
  accountType: ReconciliationAccountTier | undefined;
  onAccountTypeChange: (value: ReconciliationAccountTier) => void;
  targetFloat: string;
  onTargetFloatChange: (value: string) => void;
  nameError: string | undefined;
  accountTypeError: string | undefined;
  targetFloatError: string | undefined;
  submitError: string | undefined;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function CreateAccountDialogView({
  open,
  onOpenChange,
  name,
  onNameChange,
  accountType,
  onAccountTypeChange,
  targetFloat,
  onTargetFloatChange,
  nameError,
  accountTypeError,
  targetFloatError,
  submitError,
  onSubmit,
  isSubmitting,
}: CreateAccountDialogViewProps) {
  const showTargetFloat = accountType !== undefined && isCashTier(accountType);

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <DialogTitle>{CREATE_ACCOUNT_DIALOG_COPY.title}</DialogTitle>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium"
                  htmlFor="create-account-name"
                >
                  {CREATE_ACCOUNT_DIALOG_COPY.nameLabel}
                </label>
                <input
                  id="create-account-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    onNameChange(e.target.value);
                  }}
                  placeholder={CREATE_ACCOUNT_DIALOG_COPY.namePlaceholder}
                  aria-invalid={nameError !== undefined}
                  aria-describedby={
                    nameError !== undefined
                      ? "create-account-name-error"
                      : undefined
                  }
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 aria-invalid:border-destructive"
                />
                {nameError !== undefined && (
                  <p
                    id="create-account-name-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {nameError}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium"
                  htmlFor="create-account-type"
                >
                  {CREATE_ACCOUNT_DIALOG_COPY.typeLabel}
                </label>
                <select
                  id="create-account-type"
                  value={accountType ?? ""}
                  onChange={(e) => {
                    onAccountTypeChange(
                      e.target.value as ReconciliationAccountTier,
                    );
                  }}
                  aria-invalid={accountTypeError !== undefined}
                  aria-describedby={
                    accountTypeError !== undefined
                      ? "create-account-type-error"
                      : undefined
                  }
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 aria-invalid:border-destructive"
                >
                  <option value="" disabled>
                    {CREATE_ACCOUNT_DIALOG_COPY.typePlaceholder}
                  </option>
                  <option value={ReconciliationAccountTier.Investment}>
                    {
                      CREATE_ACCOUNT_DIALOG_COPY.typeOptions[
                        ReconciliationAccountTier.Investment
                      ]
                    }
                  </option>
                  <option value={ReconciliationAccountTier.LongTerm}>
                    {
                      CREATE_ACCOUNT_DIALOG_COPY.typeOptions[
                        ReconciliationAccountTier.LongTerm
                      ]
                    }
                  </option>
                  <option value={ReconciliationAccountTier.Reserve}>
                    {
                      CREATE_ACCOUNT_DIALOG_COPY.typeOptions[
                        ReconciliationAccountTier.Reserve
                      ]
                    }
                  </option>
                  <option value={ReconciliationAccountTier.ShortTerm}>
                    {
                      CREATE_ACCOUNT_DIALOG_COPY.typeOptions[
                        ReconciliationAccountTier.ShortTerm
                      ]
                    }
                  </option>
                </select>
                {accountTypeError !== undefined && (
                  <p
                    id="create-account-type-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {accountTypeError}
                  </p>
                )}
              </div>
              {showTargetFloat && (
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-sm font-medium"
                    htmlFor="create-account-target-float"
                  >
                    {CREATE_ACCOUNT_DIALOG_COPY.targetFloatLabel}
                  </label>
                  <input
                    id="create-account-target-float"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={targetFloat}
                    onChange={(e) => {
                      onTargetFloatChange(e.target.value);
                    }}
                    placeholder={
                      CREATE_ACCOUNT_DIALOG_COPY.targetFloatPlaceholder
                    }
                    aria-invalid={targetFloatError !== undefined}
                    aria-describedby={
                      targetFloatError !== undefined
                        ? "create-account-target-float-error"
                        : undefined
                    }
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 aria-invalid:border-destructive"
                  />
                  {targetFloatError !== undefined && (
                    <p
                      id="create-account-target-float-error"
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
              <DialogClose
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
                disabled={isSubmitting}
              >
                {CREATE_ACCOUNT_DIALOG_COPY.cancelButton}
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {CREATE_ACCOUNT_DIALOG_COPY.submitButton}
              </Button>
            </div>
          </form>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  );
}
