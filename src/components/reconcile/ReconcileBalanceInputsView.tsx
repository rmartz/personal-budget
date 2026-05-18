"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ReconciliationAccount } from "@/lib/firebase/schema/reconciliation-accounts";
import type { ReconciliationExpense } from "@/lib/firebase/schema/reconciliation-expenses";

import { RECONCILE_BALANCE_INPUTS_COPY } from "./ReconcileBalanceInputsView.copy";

export interface ReconcileBalanceInputsViewProps {
  accounts: ReconciliationAccount[];
  accountBalances: Record<string, number | undefined>;
  expenses: ReconciliationExpense[];
  expenseAmounts: Record<string, number | undefined>;
  onAccountBalanceChange: (
    accountId: string,
    balance: number | undefined,
  ) => void;
  onExpenseAmountChange: (
    expenseId: string,
    amount: number | undefined,
  ) => void;
}

export function ReconcileBalanceInputsView({
  accounts,
  accountBalances,
  expenses,
  expenseAmounts,
  onAccountBalanceChange,
  onExpenseAmountChange,
}: ReconcileBalanceInputsViewProps) {
  const isEmpty = accounts.length === 0 && expenses.length === 0;

  if (isEmpty) {
    return (
      <p className="text-sm text-muted-foreground">
        {RECONCILE_BALANCE_INPUTS_COPY.emptyState}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {accounts.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold">
            {RECONCILE_BALANCE_INPUTS_COPY.accountsSectionHeading}
          </h3>
          <ul className="space-y-3">
            {accounts.map((account) => {
              const inputId = `account-balance-${account.id}`;
              const currentValue = accountBalances[account.id];
              return (
                <li key={account.id} className="flex items-center gap-3">
                  <Label
                    htmlFor={inputId}
                    className="min-w-0 flex-1 truncate text-sm"
                  >
                    {account.name}
                  </Label>
                  <Input
                    id={inputId}
                    type="number"
                    aria-label={RECONCILE_BALANCE_INPUTS_COPY.accountBalanceAriaLabel(
                      account.name,
                    )}
                    className="w-36 text-right"
                    value={currentValue ?? ""}
                    onChange={(e) => {
                      const raw = e.target.value;
                      onAccountBalanceChange(
                        account.id,
                        raw === "" ? undefined : Number(raw),
                      );
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {expenses.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold">
            {RECONCILE_BALANCE_INPUTS_COPY.expensesSectionHeading}
          </h3>
          <ul className="space-y-3">
            {expenses.map((expense) => {
              const inputId = `expense-amount-${expense.id}`;
              const currentValue = expenseAmounts[expense.id];
              return (
                <li key={expense.id} className="flex items-center gap-3">
                  <Label
                    htmlFor={inputId}
                    className="min-w-0 flex-1 truncate text-sm"
                  >
                    {expense.name}
                  </Label>
                  <Input
                    id={inputId}
                    type="number"
                    aria-label={RECONCILE_BALANCE_INPUTS_COPY.expenseAmountAriaLabel(
                      expense.name,
                    )}
                    className="w-36 text-right"
                    value={currentValue ?? ""}
                    onChange={(e) => {
                      const raw = e.target.value;
                      onExpenseAmountChange(
                        expense.id,
                        raw === "" ? undefined : Number(raw),
                      );
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
