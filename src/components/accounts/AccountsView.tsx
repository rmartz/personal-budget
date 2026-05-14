"use client";

import { Button } from "@/components/ui/button";
import type { Account, RecurringExpense } from "@/lib/firebase/schema/accounts";
import { ACCOUNTS_PAGE_COPY } from "./copy";
import { SetupSummaryRow } from "./SetupSummaryRow";

export interface AccountsViewProps {
  accounts: Account[];
  recurringExpenses: RecurringExpense[];
  onAddAccount: () => void;
}

export function AccountsView({
  accounts,
  recurringExpenses,
  onAddAccount,
}: AccountsViewProps) {
  const missingCount = 0; // TODO: compute from recurringExpenses in epic #17

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {ACCOUNTS_PAGE_COPY.title}
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddAccount}
          aria-label={ACCOUNTS_PAGE_COPY.addAccountButton}
        >
          {ACCOUNTS_PAGE_COPY.headerAddButton}
        </Button>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold tracking-widest text-muted-foreground">
          {ACCOUNTS_PAGE_COPY.setupSectionHeading}
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SetupSummaryRow
            label={ACCOUNTS_PAGE_COPY.accountsLabel}
            count={accounts.length}
            sublabel={ACCOUNTS_PAGE_COPY.accountsSublabel}
          />
          <SetupSummaryRow
            label={ACCOUNTS_PAGE_COPY.recurringExpensesLabel}
            count={recurringExpenses.length}
            sublabel={ACCOUNTS_PAGE_COPY.recurringExpensesSublabel(
              missingCount,
            )}
          />
        </div>

        {accounts.length === 0 && (
          <div className="rounded-lg border border-border bg-muted/40 px-4 py-6 text-center">
            <p className="text-sm font-medium">{ACCOUNTS_PAGE_COPY.emptyStateHeading}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {ACCOUNTS_PAGE_COPY.emptyStateBody}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={onAddAccount}
            >
              {ACCOUNTS_PAGE_COPY.addAccountButton}
            </Button>
          </div>
        )}

        {accounts.length > 0 && (
          <Button variant="outline" className="w-full" onClick={onAddAccount}>
            {ACCOUNTS_PAGE_COPY.addAccountButton}
          </Button>
        )}
      </section>
    </div>
  );
}
