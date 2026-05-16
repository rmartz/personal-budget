"use client";

import { Button } from "@/components/ui/button";
import { type ReconciliationAccount } from "@/lib/firebase/schema/reconciliation-accounts";
import {
  type ReconciliationExpense,
  ReconciliationExpenseType,
} from "@/lib/firebase/schema/reconciliation-expenses";
import { CASH_TIERS } from "@/lib/reconciliation/cash-tiers";

import { RECONCILE_SETUP_VIEW_COPY } from "./ReconcileSetupView.copy";

function isCashAccount(account: ReconciliationAccount): boolean {
  return CASH_TIERS.has(account.tier);
}

function cashTierLabel(account: ReconciliationAccount): string {
  return RECONCILE_SETUP_VIEW_COPY.cashTierLabels[account.tier];
}

function expenseTypeLabel(type: ReconciliationExpenseType): string {
  return type === ReconciliationExpenseType.StatementBalance
    ? RECONCILE_SETUP_VIEW_COPY.expenseTypeStatementBalance
    : RECONCILE_SETUP_VIEW_COPY.expenseTypeRunningBalance;
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", {
    currency: "USD",
    minimumFractionDigits: 2,
    style: "currency",
  });
}

export interface ReconcileSetupViewProps {
  accounts: ReconciliationAccount[];
  expenses: ReconciliationExpense[];
  onDeleteAccount: (account: ReconciliationAccount) => void;
  onDeleteExpense: (expense: ReconciliationExpense) => void;
  onEditAccount: (account: ReconciliationAccount) => void;
  onEditExpense: (expense: ReconciliationExpense) => void;
}

export function ReconcileSetupView({
  accounts,
  expenses,
  onDeleteAccount,
  onDeleteExpense,
  onEditAccount,
  onEditExpense,
}: ReconcileSetupViewProps) {
  const cashAccounts = accounts.filter(isCashAccount);
  const investmentAccounts = accounts.filter((a) => !isCashAccount(a));

  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 px-4 py-8">
      {/* Accounts section */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">
          {RECONCILE_SETUP_VIEW_COPY.accountsSectionHeading}
        </h2>

        {accounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {RECONCILE_SETUP_VIEW_COPY.accountsEmptyState}
          </p>
        ) : (
          <div className="space-y-6">
            {cashAccounts.length > 0 && (
              <div>
                <h3 className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  {RECONCILE_SETUP_VIEW_COPY.cashAccountsGroupLabel}
                </h3>
                <ul className="divide-y rounded-lg border">
                  {cashAccounts.map((account) => (
                    <li
                      key={account.id}
                      className="flex items-center justify-between px-4 py-3 text-sm"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{account.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {cashTierLabel(account)}
                          {account.targetFloat !== undefined &&
                            ` · ${formatCurrency(account.targetFloat)}`}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          aria-label={RECONCILE_SETUP_VIEW_COPY.editAccountAriaLabel(account.name)}
                          onClick={() => {
                            onEditAccount(account);
                          }}
                        >
                          {RECONCILE_SETUP_VIEW_COPY.editButton}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          aria-label={RECONCILE_SETUP_VIEW_COPY.deleteAccountAriaLabel(account.name)}
                          onClick={() => {
                            onDeleteAccount(account);
                          }}
                        >
                          {RECONCILE_SETUP_VIEW_COPY.deleteButton}
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {investmentAccounts.length > 0 && (
              <div>
                <h3 className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  {RECONCILE_SETUP_VIEW_COPY.investmentAccountsGroupLabel}
                </h3>
                <ul className="divide-y rounded-lg border">
                  {investmentAccounts.map((account) => (
                    <li
                      key={account.id}
                      className="flex items-center justify-between px-4 py-3 text-sm"
                    >
                      <span className="font-medium">{account.name}</span>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          aria-label={RECONCILE_SETUP_VIEW_COPY.editAccountAriaLabel(account.name)}
                          onClick={() => {
                            onEditAccount(account);
                          }}
                        >
                          {RECONCILE_SETUP_VIEW_COPY.editButton}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          aria-label={RECONCILE_SETUP_VIEW_COPY.deleteAccountAriaLabel(account.name)}
                          onClick={() => {
                            onDeleteAccount(account);
                          }}
                        >
                          {RECONCILE_SETUP_VIEW_COPY.deleteButton}
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Expenses section */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">
          {RECONCILE_SETUP_VIEW_COPY.expensesSectionHeading}
        </h2>

        {expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {RECONCILE_SETUP_VIEW_COPY.expensesEmptyState}
          </p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{expense.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {expenseTypeLabel(expense.type)} ·{" "}
                    {formatCurrency(expense.typicalAmount)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={RECONCILE_SETUP_VIEW_COPY.editExpenseAriaLabel(expense.name)}
                    onClick={() => {
                      onEditExpense(expense);
                    }}
                  >
                    {RECONCILE_SETUP_VIEW_COPY.editButton}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={RECONCILE_SETUP_VIEW_COPY.deleteExpenseAriaLabel(expense.name)}
                    onClick={() => {
                      onDeleteExpense(expense);
                    }}
                  >
                    {RECONCILE_SETUP_VIEW_COPY.deleteButton}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
