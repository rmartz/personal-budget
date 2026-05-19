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
      const payments = Array.from({ length: 12 }, () => ({ amount: 856.07 }));
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
      const payments = [{ amount: 1199.1 }];
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
      const payments = Array.from({ length: 15 }, () => ({ amount: 856.07 }));
      const result = computeRemainingBalance(annuity, payments);
      expect(result).toBe(0);
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
      const payments = Array.from({ length: 4 }, () => ({ amount: 100 }));
      const result = computeRemainingBalance(annuity, payments);
      expect(result).toBe(800);
    });

    it("clamps to 0 when total paid exceeds presentValue", () => {
      const annuity = makeAnnuity({
        monthlyMode: AnnuityMonthlyMode.Flat,
        presentValue: 300,
      });
      const payments = Array.from({ length: 4 }, () => ({ amount: 100 }));
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
      const payments = Array.from({ length: 5 }, () => ({ amount: 100 }));
      const result = computeRemainingTerm(annuity, payments);
      expect(result).toBe(7);
    });

    it("returns 0 when payment count equals durationMonths", () => {
      const annuity = makeAnnuity({ durationMonths: 12 });
      const payments = Array.from({ length: 12 }, () => ({ amount: 100 }));
      const result = computeRemainingTerm(annuity, payments);
      expect(result).toBe(0);
    });

    it("clamps to 0 when payment count exceeds durationMonths", () => {
      const annuity = makeAnnuity({ durationMonths: 12 });
      const payments = Array.from({ length: 15 }, () => ({ amount: 100 }));
      const result = computeRemainingTerm(annuity, payments);
      expect(result).toBe(0);
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
