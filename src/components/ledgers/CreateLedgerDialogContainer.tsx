"use client";

import { useAuth } from "@/hooks/use-auth";
import { useCreateLedger } from "@/hooks/use-create-ledger";
import type { CreateLedgerInput } from "@/lib/types";

import { CreateLedgerDialog } from "./CreateLedgerDialog";

export interface CreateLedgerDialogContainerProps {
  open: boolean;
  onClose: () => void;
}

export function CreateLedgerDialogContainer({
  open,
  onClose,
}: CreateLedgerDialogContainerProps) {
  const { user } = useAuth();
  const { mutateAsync, isPending } = useCreateLedger(user?.uid ?? "");

  const handleSubmit = async (data: CreateLedgerInput): Promise<void> => {
    await mutateAsync(data);
  };

  return (
    <CreateLedgerDialog
      open={open}
      onSubmit={handleSubmit}
      onClose={onClose}
      isSubmitting={isPending}
    />
  );
}
