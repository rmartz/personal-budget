"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { CREATE_ANNUITY_DIALOG_COPY } from "./copy";
import { CreateAnnuityFlatFields } from "./CreateAnnuityFlatFields";
import { CreateAnnuityModeToggle } from "./CreateAnnuityModeToggle";
import { CreateAnnuityNameField } from "./CreateAnnuityNameField";
import { CreateAnnuityPVFields } from "./CreateAnnuityPVFields";
import { AnnuityMode } from "./types";

export interface CreateAnnuityDialogViewProps {
  annualRate: string;
  annualRateError: string | undefined;
  durationMonths: string;
  durationMonthsError: string | undefined;
  isSubmitting: boolean;
  mode: AnnuityMode;
  monthlyAmount: string;
  monthlyAmountError: string | undefined;
  monthlyPreview: number | undefined;
  name: string;
  nameError: string | undefined;
  onAnnualRateChange: (value: string) => void;
  onDurationMonthsChange: (value: string) => void;
  onModeChange: (mode: AnnuityMode) => void;
  onMonthlyAmountChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onPresentValueChange: (value: string) => void;
  onSubmit: () => void;
  open: boolean;
  presentValue: string;
  presentValueError: string | undefined;
  submitError: string | undefined;
}

export function CreateAnnuityDialogView({
  annualRate,
  annualRateError,
  durationMonths,
  durationMonthsError,
  isSubmitting,
  mode,
  monthlyAmount,
  monthlyAmountError,
  monthlyPreview,
  name,
  nameError,
  onAnnualRateChange,
  onDurationMonthsChange,
  onModeChange,
  onMonthlyAmountChange,
  onNameChange,
  onOpenChange,
  onPresentValueChange,
  onSubmit,
  open,
  presentValue,
  presentValueError,
  submitError,
}: CreateAnnuityDialogViewProps) {
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
          <DialogTitle>{CREATE_ANNUITY_DIALOG_COPY.title}</DialogTitle>
        </DialogHeader>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="flex flex-col gap-4 py-2">
            <CreateAnnuityModeToggle mode={mode} onModeChange={onModeChange} />
            <CreateAnnuityNameField
              name={name}
              nameError={nameError}
              onNameChange={onNameChange}
            />
            {mode === AnnuityMode.Flat && (
              <CreateAnnuityFlatFields
                monthlyAmount={monthlyAmount}
                monthlyAmountError={monthlyAmountError}
                onMonthlyAmountChange={onMonthlyAmountChange}
              />
            )}
            {mode === AnnuityMode.PV && (
              <CreateAnnuityPVFields
                annualRate={annualRate}
                annualRateError={annualRateError}
                durationMonths={durationMonths}
                durationMonthsError={durationMonthsError}
                monthlyPreview={monthlyPreview}
                onAnnualRateChange={onAnnualRateChange}
                onDurationMonthsChange={onDurationMonthsChange}
                onPresentValueChange={onPresentValueChange}
                presentValue={presentValue}
                presentValueError={presentValueError}
              />
            )}
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
              {CREATE_ANNUITY_DIALOG_COPY.cancelButton}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? CREATE_ANNUITY_DIALOG_COPY.creatingButton
                : CREATE_ANNUITY_DIALOG_COPY.submitButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
