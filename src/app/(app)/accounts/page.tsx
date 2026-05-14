"use client";

import { useAuth } from "@/hooks/use-auth";
import { useAccounts } from "@/hooks/use-accounts";
import { AccountsView } from "@/components/accounts/AccountsView";

export default function AccountsPage() {
  const { user, loading: authLoading } = useAuth();
  const uid = user?.uid ?? "";
  const { accounts, recurringExpenses } = useAccounts(uid);

  if (authLoading || !user) {
    return null;
  }

  return (
    <AccountsView
      accounts={accounts}
      recurringExpenses={recurringExpenses}
      onAddAccount={() => {
        // TODO: open add account dialog in epic #17 (Account & Expense Setup)
      }}
    />
  );
}
