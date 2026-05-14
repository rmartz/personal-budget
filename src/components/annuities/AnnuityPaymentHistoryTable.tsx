"use client";

import type { Annuity } from "@/lib/firebase/schema/annuities";
import { Card } from "@/components/ui/card";
import { ANNUITY_CARD_COPY } from "./copy";

export interface AnnuityPaymentHistoryTableProps {
  annuity: Annuity;
}

export function AnnuityPaymentHistoryTable({
  annuity,
}: AnnuityPaymentHistoryTableProps) {
  return (
    <Card>
      <div className="px-4 py-3">
        <h3 className="text-sm font-semibold">
          {ANNUITY_CARD_COPY.paymentHistoryTitle(annuity.name.toUpperCase())}
        </h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-muted-foreground">
            <th className="px-4 py-2 font-medium">
              {ANNUITY_CARD_COPY.columnMonth}
            </th>
            <th className="px-4 py-2 text-right font-medium">
              {ANNUITY_CARD_COPY.columnPayment}
            </th>
            <th className="px-4 py-2 text-right font-medium">
              {ANNUITY_CARD_COPY.columnPrincipal}
            </th>
            <th className="px-4 py-2 text-right font-medium">
              {ANNUITY_CARD_COPY.columnInterest}
            </th>
            <th className="px-4 py-2 text-right font-medium">
              {ANNUITY_CARD_COPY.columnBalance}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              colSpan={5}
              className="px-4 py-8 text-center text-muted-foreground"
            >
              {ANNUITY_CARD_COPY.paymentHistoryEmpty}
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}
