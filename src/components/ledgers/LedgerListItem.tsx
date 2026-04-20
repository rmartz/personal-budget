import type { Ledger, UpdateLedgerInput } from "@/lib/types";
import { EditLedgerDialog } from "./EditLedgerDialog";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface LedgerListItemProps {
  ledger: Ledger;
  onEdit: (id: string, data: UpdateLedgerInput) => Promise<void>;
}

export function LedgerListItem({ ledger, onEdit }: LedgerListItemProps) {
  const totalBalance = ledger.cashBalance + ledger.investmentBalance;
  const formattedBalance = currencyFormatter.format(totalBalance);

  return (
    <li className="flex items-center justify-between rounded-lg border px-4 py-3">
      <span className="font-medium">{ledger.name}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {formattedBalance}
        </span>
        <EditLedgerDialog
          ledgerId={ledger.id}
          initialName={ledger.name}
          initialCashCap={ledger.cashCap}
          onSave={onEdit}
        />
      </div>
    </li>
  );
}
