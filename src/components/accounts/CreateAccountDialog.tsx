"use client";

import { useState } from "react";
import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";
import { CREATE_ACCOUNT_DIALOG_COPY } from "./copy";
import { CreateAccountDialogView, isCashTier } from "./CreateAccountDialogView";

export type { CreateAccountDialogViewProps } from "./CreateAccountDialogView";
export { CreateAccountDialogView } from "./CreateAccountDialogView";

export interface CreateAccountInput {
  name: string;
  type: ReconciliationAccountTier;
  targetFloat: number | undefined;
}

export interface CreateAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CreateAccountInput) => Promise<unknown>;
}

export function CreateAccountDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateAccountDialogProps) {
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState<
    ReconciliationAccountTier | undefined
  >(undefined);
  const [targetFloat, setTargetFloat] = useState("");
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [accountTypeError, setAccountTypeError] = useState<string | undefined>(
    undefined,
  );
  const [targetFloatError, setTargetFloatError] = useState<string | undefined>(
    undefined,
  );
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && isSubmitting) return;
    if (!nextOpen) {
      setName("");
      setAccountType(undefined);
      setTargetFloat("");
      setNameError(undefined);
      setAccountTypeError(undefined);
      setTargetFloatError(undefined);
      setSubmitError(undefined);
    }
    onOpenChange(nextOpen);
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    setSubmitError(undefined);
    let valid = true;
    let validatedName = "";
    let validatedType: ReconciliationAccountTier | undefined;
    let parsedTargetFloat: number | undefined;

    if (name.trim() === "") {
      setNameError(CREATE_ACCOUNT_DIALOG_COPY.nameRequiredError);
      valid = false;
    } else {
      setNameError(undefined);
      validatedName = name.trim();
    }

    if (accountType === undefined) {
      setAccountTypeError(CREATE_ACCOUNT_DIALOG_COPY.typeRequiredError);
      valid = false;
    } else {
      setAccountTypeError(undefined);
      validatedType = accountType;
    }

    if (validatedType !== undefined && isCashTier(validatedType)) {
      if (targetFloat.trim() === "") {
        setTargetFloatError(
          CREATE_ACCOUNT_DIALOG_COPY.targetFloatRequiredError,
        );
        valid = false;
      } else {
        const parsed = parseFloat(targetFloat);
        if (isNaN(parsed) || parsed <= 0) {
          setTargetFloatError(
            CREATE_ACCOUNT_DIALOG_COPY.targetFloatInvalidError,
          );
          valid = false;
        } else {
          setTargetFloatError(undefined);
          parsedTargetFloat = parsed;
        }
      }
    } else {
      setTargetFloatError(undefined);
    }

    if (!valid || validatedType === undefined) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: validatedName,
        type: validatedType,
        targetFloat: parsedTargetFloat,
      });
      handleOpenChange(false);
    } catch {
      setSubmitError(CREATE_ACCOUNT_DIALOG_COPY.submitError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <CreateAccountDialogView
      open={open}
      onOpenChange={handleOpenChange}
      name={name}
      onNameChange={setName}
      accountType={accountType}
      onAccountTypeChange={setAccountType}
      targetFloat={targetFloat}
      onTargetFloatChange={setTargetFloat}
      nameError={nameError}
      accountTypeError={accountTypeError}
      targetFloatError={targetFloatError}
      submitError={submitError}
      onSubmit={() => void handleSubmit()}
      isSubmitting={isSubmitting}
    />
  );
}
