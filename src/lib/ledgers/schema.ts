import { z } from "zod";

/**
 * Shared input contracts for ledger writes, validated identically at every
 * boundary — the HTTP endpoints the UI calls and the MCP tools agents call.
 * The field validators are exported so the MCP tools (which also carry an `id`)
 * can compose them without redefining the rules. The inferred types are
 * structurally compatible with `CreateLedgerInput` / `UpdateLedgerInput` in
 * `@/lib/types`.
 */

const ledgerName = z.string().trim().min(1);
const ledgerCashCap = z.number().nonnegative();

export const ledgerIdSchema = z
  .string()
  .min(1)
  .regex(/^[^/]+$/, "id must be a single path segment");

export const createLedgerSchema = z.object({
  name: ledgerName,
  cashCap: ledgerCashCap.optional(),
});

export const ledgerUpdateFields = {
  name: ledgerName.optional(),
  cashCap: ledgerCashCap.nullable().optional(),
};

export const updateLedgerSchema = z
  .object(ledgerUpdateFields)
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateLedgerBody = z.infer<typeof createLedgerSchema>;
export type UpdateLedgerBody = z.infer<typeof updateLedgerSchema>;
