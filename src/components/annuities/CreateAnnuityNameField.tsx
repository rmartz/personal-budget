"use client";

import { useId } from "react";

import { CREATE_ANNUITY_DIALOG_COPY } from "./copy";

export interface CreateAnnuityNameFieldProps {
  name: string;
  nameError: string | undefined;
  onNameChange: (value: string) => void;
}

export function CreateAnnuityNameField({
  name,
  nameError,
  onNameChange,
}: CreateAnnuityNameFieldProps) {
  const baseId = useId();
  const nameInputId = `${baseId}-name`;
  const nameErrorId = `${baseId}-name-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={nameInputId} className="text-sm font-medium leading-none">
        {CREATE_ANNUITY_DIALOG_COPY.nameLabel}
      </label>
      <input
        id={nameInputId}
        type="text"
        value={name}
        onChange={(e) => {
          onNameChange(e.target.value);
        }}
        placeholder={CREATE_ANNUITY_DIALOG_COPY.namePlaceholder}
        aria-invalid={nameError !== undefined}
        aria-describedby={nameError ? nameErrorId : undefined}
        className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />
      {nameError !== undefined && (
        <p id={nameErrorId} role="alert" className="text-xs text-destructive">
          {nameError}
        </p>
      )}
    </div>
  );
}
