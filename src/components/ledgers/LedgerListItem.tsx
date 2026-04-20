"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import type { Ledger } from "@/lib/types";
import { Button } from "@/components/ui/button";
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
import { LEDGER_LIST_ITEM_COPY } from "./copy";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface LedgerListItemProps {
  ledger: Ledger;
  onDelete?: (id: string) => void;
}

export function LedgerListItem({ ledger, onDelete }: LedgerListItemProps) {
  const totalBalance = ledger.cashBalance + ledger.investmentBalance;
  const formattedBalance = currencyFormatter.format(totalBalance);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <li className="flex items-center justify-between rounded-lg border px-4 py-3">
      <span className="font-medium">{ledger.name}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {formattedBalance}
        </span>
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
                  onClick={() => {
                    setDialogOpen(true);
                  }}
                >
                  {LEDGER_LIST_ITEM_COPY.deleteMenuLabel}
                </DropdownMenuItem>
              </DropdownMenuPopup>
            </DropdownMenuPositioner>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
        <AlertDialogRoot open={dialogOpen} onOpenChange={setDialogOpen}>
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
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDialogOpen(false);
                    onDelete?.(ledger.id);
                  }}
                >
                  {LEDGER_LIST_ITEM_COPY.deleteConfirmButton}
                </Button>
              </div>
            </AlertDialogPopup>
          </AlertDialogPortal>
        </AlertDialogRoot>
      </div>
    </li>
  );
}
