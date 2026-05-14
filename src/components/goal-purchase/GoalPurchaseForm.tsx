"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { currencyFormatter } from "@/lib/formatters";

import { GOAL_PURCHASE_FORM_COPY } from "./copy";

export interface GoalPurchaseFormProps {
  ledgerName: string;
  targetAmount: number;
  onSubmit: () => void;
}

export function GoalPurchaseForm({
  ledgerName,
  targetAmount,
  onSubmit,
}: GoalPurchaseFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="purchase-amount">
          {GOAL_PURCHASE_FORM_COPY.amountLabel}
        </Label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-sm text-muted-foreground">
            {GOAL_PURCHASE_FORM_COPY.amountPrefix}
          </span>
          <Input
            id="purchase-amount"
            type="number"
            min={0}
            step={0.01}
            defaultValue={targetAmount}
            className="pl-6"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="purchase-date">
          {GOAL_PURCHASE_FORM_COPY.dateLabel}
        </Label>
        <Input
          id="purchase-date"
          type="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="purchase-note">
          {GOAL_PURCHASE_FORM_COPY.noteLabel}
        </Label>
        <textarea
          id="purchase-note"
          rows={3}
          placeholder={GOAL_PURCHASE_FORM_COPY.notePlaceholder}
          className="flex w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
        <span>{GOAL_PURCHASE_FORM_COPY.expenseNote(ledgerName)}</span>
        <span className="font-mono font-medium text-foreground">
          {currencyFormatter.format(targetAmount)}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/goals"
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          {GOAL_PURCHASE_FORM_COPY.cancelButton}
        </Link>
        <Button onClick={onSubmit}>
          {GOAL_PURCHASE_FORM_COPY.submitButton}
        </Button>
      </div>
    </div>
  );
}
