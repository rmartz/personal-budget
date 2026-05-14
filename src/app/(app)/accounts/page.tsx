"use client";

import { useAuth } from "@/hooks/use-auth";
import { useAccounts } from "@/hooks/use-accounts";
import { AccountsView } from "@/components/accounts/AccountsView";

export default function AccountsPage() {
  const { user, loading: authLoading } = useAuth();
  const uid = user?.uid ?? "";
  const { accounts, recurringExpenses, isLoading } = useAccounts(uid);

  if (authLoading || !user) {
    return null;
  }

  return (
    <AccountsView
      accounts={accounts}
      recurringExpenses={recurringExpenses}
      isLoading={isLoading}
      onAddAccount={() => {
        // TODO: open add account dialog in epic #17 (Account & Expense Setup)
      }}
    />
  );
}
