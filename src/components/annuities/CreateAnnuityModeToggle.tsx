"use client";

import { CREATE_ANNUITY_DIALOG_COPY } from "./copy";
import { AnnuityMode } from "./types";

export interface CreateAnnuityModeToggleProps {
  mode: AnnuityMode;
  onModeChange: (mode: AnnuityMode) => void;
}

export function CreateAnnuityModeToggle({
  mode,
  onModeChange,
}: CreateAnnuityModeToggleProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        aria-pressed={mode === AnnuityMode.Flat}
        onClick={() => {
          onModeChange(AnnuityMode.Flat);
        }}
        className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
          mode === AnnuityMode.Flat
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background hover:bg-muted"
        }`}
      >
        {CREATE_ANNUITY_DIALOG_COPY.modeFlatButton}
      </button>
      <button
        type="button"
        aria-pressed={mode === AnnuityMode.PV}
        onClick={() => {
          onModeChange(AnnuityMode.PV);
        }}
        className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
          mode === AnnuityMode.PV
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background hover:bg-muted"
        }`}
      >
        {CREATE_ANNUITY_DIALOG_COPY.modeLoanButton}
      </button>
    </div>
  );
}
