"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { currencyFormatter } from "@/lib/formatters";

import { GOAL_PURCHASE_FORM_COPY } from "./copy";

export interface PurchaseFormData {
  amount: number;
  date: Date;
  description: string;
}

export interface GoalPurchaseFormProps {
  ledgerName: string;
  targetAmount: number;
  onSubmit: (data: PurchaseFormData) => Promise<void> | void;
}

export function GoalPurchaseForm({
  ledgerName,
  targetAmount,
  onSubmit,
}: GoalPurchaseFormProps) {
  const [amount, setAmount] = useState(targetAmount);
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");

  function handleSubmit() {
    void onSubmit({
      amount,
      date: new Date(dateStr),
      description,
    });
  }

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
            value={amount}
            onChange={(e) => {
              setAmount(parseFloat(e.target.value));
            }}
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
          value={dateStr}
          onChange={(e) => {
            setDateStr(e.target.value);
          }}
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
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
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
        <Button onClick={handleSubmit}>
          {GOAL_PURCHASE_FORM_COPY.submitButton}
        </Button>
      </div>
    </div>
  );
}
