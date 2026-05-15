"use client";

import { useState } from "react";

import type {
  CreateAnnuityInput,
  EditAnnuityInput,
} from "@/components/annuities";
import {
  AnnuityBalanceTrend,
  AnnuityCard,
  AnnuityPaymentHistoryTable,
  CreateAnnuityDialog,
  DeleteAnnuityDialog,
  EditAnnuityDialog,
} from "@/components/annuities";
import { ANNUITY_LIST_COPY } from "@/components/annuities/copy";
import { Button } from "@/components/ui/button";
import { useAnnuities } from "@/hooks/use-annuities";
import { useAuth } from "@/hooks/use-auth";
import { useDeleteAnnuity } from "@/hooks/use-delete-annuity";
import { useUpdateAnnuity } from "@/hooks/use-update-annuity";
import type { Annuity } from "@/lib/firebase/schema/annuities";
import { createAnnuity } from "@/services/annuities";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function AnnuitiesPage() {
  const { user, loading: authLoading } = useAuth();
  const uid = user?.uid ?? "";
  const { annuities, isLoading } = useAnnuities(uid);
  const { updateOne, isSubmitting: isUpdating } = useUpdateAnnuity(uid);
  const { deleteOne, isDeleting } = useDeleteAnnuity(uid);

  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingAnnuity, setEditingAnnuity] = useState<Annuity | undefined>(
    undefined,
  );
  const [deletingAnnuity, setDeletingAnnuity] = useState<Annuity | undefined>(
    undefined,
  );

  if (authLoading || !user) {
    return null;
  }

  const selectedAnnuity =
    annuities.find((a) => a.id === selectedId) ?? annuities[0];
  const totalMonthly = annuities.reduce((sum, a) => sum + a.monthlyAmount, 0);

  const handleCreate = async (data: CreateAnnuityInput) => {
    await createAnnuity(uid, {
      name: data.name,
      monthlyAmount: data.monthlyAmount,
      monthlyMode: data.monthlyMode,
      startDate: new Date(),
      durationMonths: data.durationMonths,
    });
  };

  const handleSaveEdit = async (data: EditAnnuityInput) => {
    if (!editingAnnuity) return;
    await updateOne(editingAnnuity.id, data);
    setEditingAnnuity(undefined);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAnnuity) return;
    await deleteOne(deletingAnnuity.id);
    if (selectedId === deletingAnnuity.id) {
      setSelectedId(undefined);
    }
    setDeletingAnnuity(undefined);
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {ANNUITY_LIST_COPY.title}
          </h1>
          {!isLoading && annuities.length > 0 && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {ANNUITY_LIST_COPY.summaryLine(
                annuities.length,
                currencyFormatter.format(totalMonthly),
              )}
            </p>
          )}
        </div>
        <Button
          onClick={() => {
            setCreateDialogOpen(true);
          }}
        >
          {ANNUITY_LIST_COPY.newAnnuityButton}
        </Button>
      </div>

      {!isLoading && annuities.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          {ANNUITY_LIST_COPY.emptyStateMessage}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {annuities.map((annuity) => (
              <AnnuityCard
                key={annuity.id}
                annuity={annuity}
                isSelected={annuity.id === selectedAnnuity?.id}
                onSelect={() => {
                  setSelectedId(annuity.id);
                }}
                onEdit={() => {
                  setEditingAnnuity(annuity);
                }}
                onDelete={() => {
                  setDeletingAnnuity(annuity);
                }}
              />
            ))}
          </div>

          {selectedAnnuity !== undefined && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <AnnuityPaymentHistoryTable annuity={selectedAnnuity} />
              <AnnuityBalanceTrend annuity={selectedAnnuity} />
            </div>
          )}
        </>
      )}

      <CreateAnnuityDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreate}
      />

      {editingAnnuity !== undefined && (
        <EditAnnuityDialog
          open={true}
          onOpenChange={(open) => {
            if (!open && !isUpdating) setEditingAnnuity(undefined);
          }}
          annuity={editingAnnuity}
          onSave={handleSaveEdit}
        />
      )}

      {deletingAnnuity !== undefined && (
        <DeleteAnnuityDialog
          open={true}
          onOpenChange={(open) => {
            if (!open && !isDeleting) setDeletingAnnuity(undefined);
          }}
          annuity={deletingAnnuity}
          onConfirm={() => {
            void handleConfirmDelete();
          }}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
