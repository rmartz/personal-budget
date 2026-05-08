"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import type { Ledger, UpdateLedgerInput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Bar } from "@/components/ui/bar";
import {
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogPopup,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuPopup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EditLedgerDialog } from "./EditLedgerDialog";
import { LEDGER_LIST_ITEM_COPY, LEDGERS_PAGE_COPY } from "./copy";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export interface LedgerListItemViewProps {
  ledger: Ledger;
  onEdit: (id: string, data: UpdateLedgerInput) => Promise<void>;
  deleteDialogOpen: boolean;
  onDeleteDialogOpenChange: (open: boolean) => void;
  onDeleteMenuClick: () => void;
  onDeleteConfirm: () => void;
}

export function LedgerListItemView({
  ledger,
  onEdit,
  deleteDialogOpen,
  onDeleteDialogOpenChange,
  onDeleteMenuClick,
  onDeleteConfirm,
}: LedgerListItemViewProps) {
  const totalBalance = ledger.cashBalance + ledger.investmentBalance;
  const capUsagePercent =
    ledger.cashCap != null && ledger.cashCap > 0
      ? (ledger.cashBalance / ledger.cashCap) * 100
      : 0;

  return (
    <tr className="border-b last:border-b-0">
      <td className="w-[30%] px-4 py-3 font-medium">{ledger.name}</td>
      <td className="px-4 py-3 text-right font-mono text-sm">
        {currencyFormatter.format(ledger.cashBalance)}
      </td>
      <td className="px-4 py-3 text-right font-mono text-sm">
        {currencyFormatter.format(ledger.investmentBalance)}
      </td>
      <td className="w-[25%] px-4 py-3">
        {ledger.cashCap != null ? (
          <div className="flex items-center gap-2">
            <Bar value={capUsagePercent} className="max-w-24" />
            <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
              {currencyFormatter.format(ledger.cashBalance)} /{" "}
              {currencyFormatter.format(ledger.cashCap)}
            </span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">
            {LEDGERS_PAGE_COPY.noCashCapLabel}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-right font-mono text-sm">
        {currencyFormatter.format(totalBalance)}
      </td>
      <td className="px-4 py-3 text-right text-sm">
        {(ledger.goalsCount ?? 0) > 0
          ? ledger.goalsCount
          : LEDGER_LIST_ITEM_COPY.goalsNone}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <EditLedgerDialog
            ledgerId={ledger.id}
            initialName={ledger.name}
            initialCashCap={ledger.cashCap}
            onSave={onEdit}
          />
          <DropdownMenuRoot>
            <DropdownMenuTrigger
              aria-label={LEDGER_LIST_ITEM_COPY.overflowMenuLabel}
              className="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted"
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuPositioner align="end">
                <DropdownMenuPopup>
                  <DropdownMenuItem
                    className="text-destructive hover:bg-destructive/10 data-[highlighted]:bg-destructive/10"
                    onClick={onDeleteMenuClick}
                  >
                    {LEDGER_LIST_ITEM_COPY.deleteMenuLabel}
                  </DropdownMenuItem>
                </DropdownMenuPopup>
              </DropdownMenuPositioner>
            </DropdownMenuPortal>
          </DropdownMenuRoot>
          <AlertDialogRoot
            open={deleteDialogOpen}
            onOpenChange={onDeleteDialogOpenChange}
          >
            <AlertDialogPortal>
              <AlertDialogBackdrop />
              <AlertDialogPopup>
                <AlertDialogTitle>
                  {LEDGER_LIST_ITEM_COPY.deleteConfirmTitle}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {LEDGER_LIST_ITEM_COPY.deleteConfirmDescription}
                </AlertDialogDescription>
                <div className="mt-6 flex justify-end gap-3">
                  <AlertDialogClose>
                    {LEDGER_LIST_ITEM_COPY.deleteCancelButton}
                  </AlertDialogClose>
                  <Button variant="destructive" onClick={onDeleteConfirm}>
                    {LEDGER_LIST_ITEM_COPY.deleteConfirmButton}
                  </Button>
                </div>
              </AlertDialogPopup>
            </AlertDialogPortal>
          </AlertDialogRoot>
        </div>
      </td>
    </tr>
  );
}

interface LedgerListItemProps {
  ledger: Ledger;
  onEdit: (id: string, data: UpdateLedgerInput) => Promise<void>;
  onDelete: (id: string) => void;
}

export function LedgerListItem({
  ledger,
  onEdit,
  onDelete,
}: LedgerListItemProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  function handleDeleteMenuClick() {
    setDeleteDialogOpen(true);
  }

  function handleDeleteConfirm() {
    setDeleteDialogOpen(false);
    onDelete(ledger.id);
  }

  return (
    <LedgerListItemView
      ledger={ledger}
      onEdit={onEdit}
      deleteDialogOpen={deleteDialogOpen}
      onDeleteDialogOpenChange={setDeleteDialogOpen}
      onDeleteMenuClick={handleDeleteMenuClick}
      onDeleteConfirm={handleDeleteConfirm}
    />
  );
}
