import type { Ledger } from "@/lib/types";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface LedgerListItemProps {
  ledger: Ledger;
}

export function LedgerListItem({ ledger }: LedgerListItemProps) {
  const totalBalance = ledger.cashBalance + ledger.investmentBalance;
  const formattedBalance = currencyFormatter.format(totalBalance);

  return (
    <li className="flex items-center justify-between rounded-lg border px-4 py-3">
      <span className="font-medium">{ledger.name}</span>
      <span className="text-sm text-zinc-600 dark:text-zinc-400">
        {formattedBalance}
      </span>
    </li>
  );
}
