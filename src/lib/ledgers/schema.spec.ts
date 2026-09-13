import { describe, expect, it } from "vitest";

import {
  createLedgerSchema,
  ledgerIdSchema,
  updateLedgerSchema,
} from "./schema";

describe("ledgerIdSchema", () => {
  it("accepts a valid key", () => {
    expect(ledgerIdSchema.safeParse("ledger-abc123").success).toBe(true);
  });

  it("rejects an empty string", () => {
    expect(ledgerIdSchema.safeParse("").success).toBe(false);
  });

  it("rejects a value containing a forward slash", () => {
    expect(ledgerIdSchema.safeParse("a/b").success).toBe(false);
  });
});

describe("createLedgerSchema", () => {
  it("accepts a name with an optional cash cap", () => {
    const result = createLedgerSchema.safeParse({
      name: "Groceries",
      cashCap: 300,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty name", () => {
    const result = createLedgerSchema.safeParse({ name: "   " });
    expect(result.success).toBe(false);
  });

  it("rejects a negative cash cap", () => {
    const result = createLedgerSchema.safeParse({
      name: "Groceries",
      cashCap: -5,
    });
    expect(result.success).toBe(false);
  });
});

describe("updateLedgerSchema", () => {
  it("accepts a partial update with one field", () => {
    const result = updateLedgerSchema.safeParse({ name: "Rent" });
    expect(result.success).toBe(true);
  });

  it("accepts clearing the cash cap with null", () => {
    const result = updateLedgerSchema.safeParse({ cashCap: null });
    expect(result.success).toBe(true);
  });

  it("rejects an empty update object", () => {
    const result = updateLedgerSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
