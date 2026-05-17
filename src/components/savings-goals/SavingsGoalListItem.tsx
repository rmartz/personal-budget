"use client";

import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import { useState } from "react";

import {
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogPopup,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Bar } from "@/components/ui/bar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenuPopup,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

import { SAVINGS_GOAL_LIST_COPY, SAVINGS_GOAL_LIST_ITEM_COPY } from "./copy";
import { EditSavingsGoalDialog } from "./EditSavingsGoalDialog";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export interface SavingsGoalListItemViewProps {
  goal: BudgetLedgerSavingsGoal;
  deleteDialogOpen: boolean;
  dropdownOpen?: boolean;
  isFirst: boolean;
  isLast: boolean;
  prevGoalId: string | undefined;
  nextGoalId: string | undefined;
  onDeleteDialogOpenChange: (open: boolean) => void;
  onDeleteMenuClick: () => void;
  onDeleteConfirm: () => void;
  onEdit: (
    id: string,
    data: { name: string; targetAmount: number },
  ) => Promise<void>;
  onReorder: (goalId: string, swapWithId: string) => Promise<void>;
}

export function SavingsGoalListItemView({
  goal,
  deleteDialogOpen,
  dropdownOpen,
  isFirst,
  isLast,
  prevGoalId,
  nextGoalId,
  onDeleteDialogOpenChange,
  onDeleteMenuClick,
  onDeleteConfirm,
  onEdit,
  onReorder,
}: SavingsGoalListItemViewProps) {
  const progressPercent =
    goal.targetAmount > 0
      ? Math.round((goal.fundedAmount / goal.targetAmount) * 100)
      : 0;
  const isFunded = goal.targetAmount > 0 && goal.fundedAmount >= goal.targetAmount;
  const progressLabel = isFunded
    ? SAVINGS_GOAL_LIST_ITEM_COPY.fundedLabel
    : `${progressPercent.toString()}%`;

  return (
    <tr className="border-b last:border-b-0">
      <td className="px-4 py-3 text-center font-mono text-sm text-muted-foreground">
        {goal.priority}
      </td>
      <td className="px-4 py-3 font-medium">{goal.name}</td>
      <td className="px-4 py-3 text-right font-mono text-sm">
        {currencyFormatter.format(goal.targetAmount)}
      </td>
      <td className="px-4 py-3 text-right font-mono text-sm">
        {currencyFormatter.format(goal.fundedAmount)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Bar value={Math.min(progressPercent, 100)} className="max-w-24" />
          <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
            {progressLabel}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          {!isFirst && prevGoalId !== undefined && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`${SAVINGS_GOAL_LIST_COPY.moveUpButton} ${goal.name}`}
              onClick={() => {
                void onReorder(goal.id, prevGoalId);
              }}
            >
              <ChevronUp aria-hidden="true" />
            </Button>
          )}
          {!isLast && nextGoalId !== undefined && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`${SAVINGS_GOAL_LIST_COPY.moveDownButton} ${goal.name}`}
              onClick={() => {
                void onReorder(goal.id, nextGoalId);
              }}
            >
              <ChevronDown aria-hidden="true" />
            </Button>
          )}
          <EditSavingsGoalDialog goal={goal} onSave={onEdit} />
          <DropdownMenuRoot open={dropdownOpen}>
            <DropdownMenuTrigger
              aria-label={SAVINGS_GOAL_LIST_ITEM_COPY.overflowMenuLabel}
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
                    {SAVINGS_GOAL_LIST_ITEM_COPY.deleteMenuLabel}
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
                  {SAVINGS_GOAL_LIST_ITEM_COPY.deleteConfirmTitle}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {SAVINGS_GOAL_LIST_ITEM_COPY.deleteConfirmDescription}
                </AlertDialogDescription>
                <div className="mt-6 flex justify-end gap-3">
                  <AlertDialogClose>
                    {SAVINGS_GOAL_LIST_ITEM_COPY.deleteCancelButton}
                  </AlertDialogClose>
                  <Button variant="destructive" onClick={onDeleteConfirm}>
                    {SAVINGS_GOAL_LIST_ITEM_COPY.deleteConfirmButton}
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

interface SavingsGoalListItemProps {
  goal: BudgetLedgerSavingsGoal;
  isFirst: boolean;
  isLast: boolean;
  prevGoalId: string | undefined;
  nextGoalId: string | undefined;
  onDelete: (id: string) => void;
  onEdit: (
    id: string,
    data: { name: string; targetAmount: number },
  ) => Promise<void>;
  onReorder: (goalId: string, swapWithId: string) => Promise<void>;
}

export function SavingsGoalListItem({
  goal,
  isFirst,
  isLast,
  prevGoalId,
  nextGoalId,
  onDelete,
  onEdit,
  onReorder,
}: SavingsGoalListItemProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  function handleDeleteMenuClick() {
    setDeleteDialogOpen(true);
  }

  function handleDeleteConfirm() {
    setDeleteDialogOpen(false);
    onDelete(goal.id);
  }

  return (
    <SavingsGoalListItemView
      goal={goal}
      deleteDialogOpen={deleteDialogOpen}
      isFirst={isFirst}
      isLast={isLast}
      prevGoalId={prevGoalId}
      nextGoalId={nextGoalId}
      onDeleteDialogOpenChange={setDeleteDialogOpen}
      onDeleteMenuClick={handleDeleteMenuClick}
      onDeleteConfirm={handleDeleteConfirm}
      onEdit={onEdit}
      onReorder={onReorder}
    />
  );
}
