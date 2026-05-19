import { describe, expect, it } from "vitest";

import {
  type Annuity,
  AnnuityMonthlyMode,
} from "@/lib/firebase/schema/annuities";

import {
  computeRemainingBalance,
  computeRemainingTerm,
} from "./annuity-status";

function makeAnnuity(overrides: Partial<Annuity> = {}): Annuity {
  return {
    id: "annuity-1",
    name: "Test Annuity",
    monthlyAmount: 100,
    monthlyMode: AnnuityMonthlyMode.Flat,
    startDate: new Date("2024-01-01T00:00:00.000Z"),
    durationMonths: 12,
    ...overrides,
  };
}

/**
 * Returns an array of payment objects with distinct monthly dates.
 * Each payment falls in a different calendar month starting from 2024-01.
 */
function makeMonthlyPayments(
  count: number,
  amount: number,
): { amount: number; date: Date }[] {
  return Array.from({ length: count }, (_, i) => ({
    amount,
    date: new Date(2024 + Math.floor(i / 12), i % 12, 1),
  }));
}

describe("computeRemainingBalance", () => {
  describe("PV-derived annuity uses amortization formula", () => {
    it("returns presentValue when no payments have been made", () => {
      const annuity = makeAnnuity({
        monthlyMode: AnnuityMonthlyMode.PVDerived,
        presentValue: 10000,
        annualRatePercent: 5,
        durationMonths: 12,
      });
      const result = computeRemainingBalance(annuity, []);
      expect(result).toBe(10000);
    });

    it("returns approximately 0 when all payments have been made", () => {
      const annuity = makeAnnuity({
        monthlyMode: AnnuityMonthlyMode.PVDerived,
        presentValue: 10000,
        annualRatePercent: 5,
        durationMonths: 12,
      });
      const payments = makeMonthlyPayments(12, 856.07);
      const result = computeRemainingBalance(annuity, payments);
      expect(result).toBeDefined();
      expect(Math.abs(result!)).toBeLessThan(0.01);
    });

    it("returns the correct mid-term balance", () => {
      const annuity = makeAnnuity({
        monthlyMode: AnnuityMonthlyMode.PVDerived,
        presentValue: 200000,
        annualRatePercent: 6,
        durationMonths: 360,
      });
      const payments = [{ amount: 1199.1, date: new Date(2024, 0, 1) }];
      const result = computeRemainingBalance(annuity, payments);
      expect(result).toBeDefined();
      expect(Math.round(result! * 100) / 100).toBe(199800.9);
    });

    it("clamps to 0 when payments exceed the term", () => {
      const annuity = makeAnnuity({
        monthlyMode: AnnuityMonthlyMode.PVDerived,
        presentValue: 10000,
        annualRatePercent: 5,
        durationMonths: 12,
      });
      const payments = makeMonthlyPayments(15, 856.07);
      const result = computeRemainingBalance(annuity, payments);
      expect(result).toBe(0);
    });

    it("ignores payment amount when computing elapsed months for amortization", () => {
      const annuity = makeAnnuity({
        monthlyMode: AnnuityMonthlyMode.PVDerived,
        presentValue: 200000,
        annualRatePercent: 6,
        durationMonths: 360,
      });
      // Two payments in the same calendar month — one at scheduled PMT,
      // one extra partial payment. The balance should reflect 1 elapsed month,
      // not 2, because only distinct months are counted.
      const scheduledDate = new Date(2024, 0, 1);
      const payments = [
        { amount: 1199.1, date: scheduledDate },
        { amount: 500, date: scheduledDate },
      ];
      const result = computeRemainingBalance(annuity, payments);
      expect(result).toBeDefined();
      // Same as the 1-payment mid-term balance test
      expect(Math.round(result! * 100) / 100).toBe(199800.9);
    });

    it("returns undefined when annualRatePercent is undefined", () => {
      const annuity = makeAnnuity({
        monthlyMode: AnnuityMonthlyMode.PVDerived,
        presentValue: 10000,
        annualRatePercent: undefined,
        durationMonths: 12,
      });
      const result = computeRemainingBalance(annuity, []);
      expect(result).toBeUndefined();
    });

    it("returns undefined when durationMonths is undefined", () => {
      const annuity = makeAnnuity({
        monthlyMode: AnnuityMonthlyMode.PVDerived,
        presentValue: 10000,
        annualRatePercent: 5,
        durationMonths: undefined,
      });
      const result = computeRemainingBalance(annuity, []);
      expect(result).toBeUndefined();
    });
  });

  describe("flat annuity with presentValue subtracts total paid", () => {
    it("returns presentValue minus total payments", () => {
      const annuity = makeAnnuity({
        monthlyMode: AnnuityMonthlyMode.Flat,
        presentValue: 1200,
        durationMonths: 12,
      });
      const payments = makeMonthlyPayments(4, 100);
      const result = computeRemainingBalance(annuity, payments);
      expect(result).toBe(800);
    });

    it("clamps to 0 when total paid exceeds presentValue", () => {
      const annuity = makeAnnuity({
        monthlyMode: AnnuityMonthlyMode.Flat,
        presentValue: 300,
      });
      const payments = makeMonthlyPayments(4, 100);
      const result = computeRemainingBalance(annuity, payments);
      expect(result).toBe(0);
    });
  });

  describe("flat annuity without presentValue returns undefined", () => {
    it("returns undefined when annuity has no presentValue", () => {
      const annuity = makeAnnuity({
        monthlyMode: AnnuityMonthlyMode.Flat,
        presentValue: undefined,
      });
      const result = computeRemainingBalance(annuity, []);
      expect(result).toBeUndefined();
    });
  });
});

describe("computeRemainingTerm", () => {
  describe("returns remaining months when durationMonths is defined", () => {
    it("returns full durationMonths when no payments made", () => {
      const annuity = makeAnnuity({ durationMonths: 24 });
      const result = computeRemainingTerm(annuity, []);
      expect(result).toBe(24);
    });

    it("returns durationMonths minus payment count after some payments", () => {
      const annuity = makeAnnuity({ durationMonths: 12 });
      const payments = makeMonthlyPayments(5, 100);
      const result = computeRemainingTerm(annuity, payments);
      expect(result).toBe(7);
    });

    it("returns 0 when payment count equals durationMonths", () => {
      const annuity = makeAnnuity({ durationMonths: 12 });
      const payments = makeMonthlyPayments(12, 100);
      const result = computeRemainingTerm(annuity, payments);
      expect(result).toBe(0);
    });

    it("clamps to 0 when payment count exceeds durationMonths", () => {
      const annuity = makeAnnuity({ durationMonths: 12 });
      const payments = makeMonthlyPayments(15, 100);
      const result = computeRemainingTerm(annuity, payments);
      expect(result).toBe(0);
    });

    it("counts multiple payments in the same month as one elapsed period", () => {
      const annuity = makeAnnuity({ durationMonths: 12 });
      const sameMonth = new Date(2024, 0, 1);
      const payments = [
        { amount: 100, date: sameMonth },
        { amount: 50, date: sameMonth },
      ];
      const result = computeRemainingTerm(annuity, payments);
      expect(result).toBe(11);
    });
  });

  describe("returns undefined when durationMonths is undefined", () => {
    it("returns undefined for an indefinite annuity", () => {
      const annuity = makeAnnuity({ durationMonths: undefined });
      const result = computeRemainingTerm(annuity, []);
      expect(result).toBeUndefined();
    });
  });
});
